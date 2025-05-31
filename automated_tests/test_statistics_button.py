def test_statistics_button(driver):
    driver.get("https://example.com")

    # Click 'Statistics' link and verify it goes to the Statistics page
    about_link = driver.find_element("xpath", '//a[text()="Statistics"]')
    about_link.click()

    assert "/statistics" in driver.current_url