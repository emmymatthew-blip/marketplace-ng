-- Insert sample users for testing
INSERT INTO users (id, name, email, role, isVerified, companyName, image, createdAt, updatedAt) VALUES
('usr_1', 'John Smith', 'john@example.com', 'END_USER_PRINTER', true, 'Print Solutions Inc.', 'https://i.pravatar.cc/150?img=1', NOW(), NOW()),
('usr_2', 'Sarah Johnson', 'sarah@example.com', 'MANUFACTURER', true, 'Tech Manufacturing Co.', 'https://i.pravatar.cc/150?img=2', NOW(), NOW()),
('usr_3', 'Mike Brown', 'mike@example.com', 'PRINT_BUYER', false, NULL, 'https://i.pravatar.cc/150?img=3', NOW(), NOW()),
('usr_4', 'Lisa Chen', 'lisa@example.com', 'END_USER_PRINTER', true, 'Digital Print Hub', 'https://i.pravatar.cc/150?img=4', NOW(), NOW()),
('usr_5', 'David Wilson', 'david@example.com', 'MANUFACTURER', false, 'Wilson Industries', 'https://i.pravatar.cc/150?img=5', NOW(), NOW()),
('usr_6', 'Emma Davis', 'emma@example.com', 'PRINT_BROKER', true, NULL, 'https://i.pravatar.cc/150?img=6', NOW(), NOW()),
('usr_7', 'Alex Turner', 'alex@example.com', 'END_USER_PRINTER', true, 'Turner Print Services', 'https://i.pravatar.cc/150?img=7', NOW(), NOW()),
('usr_8', 'Maria Garcia', 'maria@example.com', 'MANUFACTURER', true, 'Garcia Manufacturing', 'https://i.pravatar.cc/150?img=8', NOW(), NOW()),
('usr_9', 'James Lee', 'james@example.com', 'SOFTWARE_DEALER', false, NULL, 'https://i.pravatar.cc/150?img=9', NOW(), NOW()),
('usr_10', 'Sophie Anderson', 'sophie@example.com', 'END_USER_PRINTER', true, 'Anderson Print Co.', 'https://i.pravatar.cc/150?img=10', NOW(), NOW()); 