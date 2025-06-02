from login import *

def test_dashboard_button(driver):
    login(driver)
    driver.get("http://localhost:3000//applications")

    # Click 'Dashboard' link and verify it goes to the Dashboard page
    about_link = driver.find_element("xpath", '//a[text()="Dashboard"]')
    about_link.click()

    assert "/dashboard" in driver.current_url