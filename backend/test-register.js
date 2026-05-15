async function test() {
  try {
    const formData = new FormData();
    formData.append("firstName", "Test");
    formData.append("lastName", "User");
    formData.append("email", "test.user55@mail.com");
    formData.append("password", "test@123");
    
    console.log("Sending request...");
    const res = await fetch("http://localhost:4000/user-api/users", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    console.log(res.status);
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}
test();
