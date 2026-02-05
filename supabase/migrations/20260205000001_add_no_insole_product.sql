-- Add "ไม่มีแผ่นรองใน" product for insole selection
INSERT INTO public.products (type, name, description)
VALUES ('insole', 'ไม่มีแผ่นรองใน', 'ไม่มีแผ่นรองใน')
ON CONFLICT DO NOTHING;
