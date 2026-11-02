-- BharatTrade AI: Atomic Paper Trading Stored Procedure
-- Handles atomic balance check, cash deduction/addition, and order recording.

create or replace function public.execute_paper_trade(
  p_symbol text,
  p_side text,
  p_quantity integer,
  p_price numeric
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_portfolio record;
  v_total_cost numeric;
  v_owned_qty integer := 0;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'Unauthorized: User is not authenticated';
  end if;

  if p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  if p_price <= 0 then
    raise exception 'Price must be greater than zero';
  end if;

  if p_side not in ('BUY', 'SELL') then
    raise exception 'Invalid side: must be BUY or SELL';
  end if;

  -- Lock the portfolio row for atomic update
  select * into v_portfolio
  from public.paper_portfolios
  where user_id = v_user_id
  for update;

  if not found then
    -- Create default portfolio if missing
    insert into public.paper_portfolios (user_id, name, virtual_cash)
    values (v_user_id, 'My Paper Portfolio', 100000)
    returning * into v_portfolio;
  end if;

  v_total_cost := p_quantity * p_price;

  if p_side = 'BUY' then
    if v_portfolio.virtual_cash < v_total_cost then
      raise exception 'Insufficient virtual cash balance (available: ₹%, required: ₹%)',
        v_portfolio.virtual_cash, v_total_cost;
    end if;

    -- Deduct virtual cash
    update public.paper_portfolios
    set virtual_cash = virtual_cash - v_total_cost
    where id = v_portfolio.id;

  elsif p_side = 'SELL' then
    -- Check user's current net holdings of this symbol
    select coalesce(sum(case when side = 'BUY' then quantity else -quantity end), 0)
    into v_owned_qty
    from public.paper_orders
    where user_id = v_user_id and symbol = p_symbol and status = 'EXECUTED';

    if v_owned_qty < p_quantity then
      raise exception 'Insufficient shares to sell (owned: %, requested: %)',
        v_owned_qty, p_quantity;
    end if;

    -- Add cash from sale
    update public.paper_portfolios
    set virtual_cash = virtual_cash + v_total_cost
    where id = v_portfolio.id;
  end if;

  -- Record the order
  insert into public.paper_orders (
    portfolio_id, user_id, symbol, side, quantity, price, status
  )
  values (
    v_portfolio.id, v_user_id, p_symbol, p_side, p_quantity, p_price, 'EXECUTED'
  )
  returning id into v_order_id;

  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'symbol', p_symbol,
    'side', p_side,
    'quantity', p_quantity,
    'price', p_price,
    'new_cash', case
      when p_side = 'BUY' then v_portfolio.virtual_cash - v_total_cost
      else v_portfolio.virtual_cash + v_total_cost
    end
  );
end;
$$;
