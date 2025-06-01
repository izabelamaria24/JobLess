def test_statistics_button(driver):
    driver.get("http://localhost:3000/applications")

    # Click 'Get Interview Questions' link and verify it goes to the interview-questions page
    about_link = driver.find_element("xpath", '//a[text()="Get Interview Questions"]')
    about_link.click()

    assert "/interview-questions" in driver.current_url
