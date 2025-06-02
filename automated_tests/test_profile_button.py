from login import *

def test_profile_button(driver):
    login(driver)
    driver.get("http://localhost:3000/")

    # Click 'Profile' link and verify it goes to the Profile page
    about_link = driver.find_element("xpath", '//a[text()="Profile"]')
    about_link.click()

    assert "/profile" in driver.current_url