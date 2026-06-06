-- Optional sample seed for testing only.
-- Do not run this against the live empty production database unless you intentionally want demo data.

insert into customers (id, name, email, phone, zip, source, preferences) values
('CUST-1000','M. Ramirez','customer1@example.com','916-555-0107','95661','promo-route-check','["beef","chicken","pork"]'),
('CUST-1001','J. Thompson','customer2@example.com','916-555-0111','95765','promo-route-check','["ribeye","filet","new york strip"]')
on conflict (id) do nothing;

insert into orders (id, customer_id, customer_name, phone, zip, route_id, box, status, fulfillment, value, cost_estimate, margin_estimate, delivery_date, delivery_window, notes, promo) values
('CCP-1007','CUST-1000','M. Ramirez','916-555-0107','95661','roseville','Family Box','ordered','pending',525,305,220,'2026-06-10','2-6 PM','Prefers family portions and weeknight meals.','CHEESECAKE-48'),
('CCP-1011','CUST-1001','J. Thompson','916-555-0111','95765','rocklin-lincoln','Steak Lovers Club','loaded','packed',740,429,311,'2026-06-11','2-6 PM','Call 20 minutes before arrival.','CHEESECAKE-48')
on conflict (id) do nothing;

insert into order_products (order_id, sku, name, qty, unit, fulfilled) values
('CCP-1007','BEEF-1','beef',10,'lbs',0),
('CCP-1007','CHICKEN-2','chicken',6,'lbs',0),
('CCP-1011','RIBEYE-1','ribeye',10,'lbs',10),
('CCP-1011','FILET-2','filet',6,'lbs',4);

insert into restock_issues (id, order_id, route_id, sku, product, needed, available, severity, action) values
('RI-1001','CCP-1011','rocklin-lincoln','FILET-2','filet',6,4,'medium','Offer filet substitution or hold 2 lbs for next restock.')
on conflict (id) do nothing;

insert into learning_events (id, role, event_type, summary, signal, route_id, order_id) values
('LEARN-1001','system','route-conversion','Rocklin steak leads respond to ribeye and filet bundle language.',8,'rocklin-lincoln',''),
('LEARN-1002','driver','delivery-note','Call-ahead notes reduce missed stops on premium routes.',7,'roseville','')
on conflict (id) do nothing;
