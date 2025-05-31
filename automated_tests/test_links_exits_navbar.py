def test_navbar_links_exist(driver):
    driver.get("https://example.com")

    # Check that expected navbar links are present by text
    assert driver.find_element("xpath", '//a[text()="Dashboard"]')
    assert driver.find_element("xpath", '//a[text()="Applications"]')
    assert driver.find_element("xpath", '//a[text()="Profile"]')
    assert driver.find_element("xpath", '//a[text()="Statistics"]')