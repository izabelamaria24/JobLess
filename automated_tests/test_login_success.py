def test_login_success(driver):
    driver.get("http://localhost:3000/login")

    # locate elements using XPath
    username_input = driver.find_element("xpath", '//input[@name="username"]')
    password_input = driver.find_element("xpath", '//input[@name="password"]')
    submit_button = driver.find_element("xpath", '//button[@type="submit"]')

    username_input.send_keys("testuser")
    password_input.send_keys("securepassword")
    submit_button.click()

    # assert dashboard title after successful login
    assert "dashboard" in driver.current_url
