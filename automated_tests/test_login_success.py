from selenium.webdriver.support.ui import WebDriverWait

def test_login_success(driver):
    driver.get("http://localhost:3000/login")

    # locate elements using XPath
    username_input = driver.find_element("xpath", '//input[@name="email"]')
    password_input = driver.find_element("xpath", '//input[@name="password"]')
    submit_button = driver.find_element("xpath", '//button[text()="Login"]')

    username_input.send_keys("user@test.com")
    password_input.send_keys("UserPa55!")
    submit_button.click()

    WebDriverWait(driver, 10).until(lambda d: "dashboard" in d.current_url)

    # assert dashboard title after successful login
    assert "dashboard" in driver.current_url
