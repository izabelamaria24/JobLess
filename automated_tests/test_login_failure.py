def test_login_failure(driver):
    driver.get("http://localhost:3000/login")

    # Locate elements using XPath
    username_input = driver.find_element("xpath", '//input[@name="username"]')
    password_input = driver.find_element("xpath", '//input[@name="password"]')
    submit_button = driver.find_element("xpath", '//button[@type="submit"]')

    username_input.send_keys("testusergresit")
    password_input.send_keys("securepasswordgresit")
    submit_button.click()


    assert "dashboard" not in driver.current_url
