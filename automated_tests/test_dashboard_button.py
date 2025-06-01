def test_dashboard_button(driver):
    driver.get("http://localhost:3000//applications")

    # Click 'Dashboard' link and verify it goes to the Dashboard page
    about_link = driver.find_element("xpath", '//a[text()="Dashboard"]')
    about_link.click()

    assert "/dahboard" in driver.current_url
