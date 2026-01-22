// Copy and paste this in your browser console (F12 → Console tab)
// Or run this on your admin page

localStorage.setItem('adminToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmFiOTAxZTE0OGQzMmQ5NGZhYTU3OCIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NjkwMzk0NTYsImV4cCI6MTc2OTY0NDI1Nn0.800OOaHKWMly6hUaC4B0l2RZ8S29YdCGo4kuB685hKI');

localStorage.setItem('adminUser', JSON.stringify({
  "id": "696ab901e148d32d94faa578",
  "username": "admin",
  "email": "admin@velvetwords.com"
}));

console.log('✅ Fresh token set! Refresh the page.');
location.reload();