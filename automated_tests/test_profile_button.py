def test_profile_button(driver):
    driver.get("https://example.com")

    # Click 'Profile' link and verify it goes to the Profile page
    about_link = driver.find_element("xpath", '//a[text()="Profile"]')
    about_link.click()

    assert "/profile" in driver.current_url