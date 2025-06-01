from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

def test_upload_cv_button(driver):
    driver.get("http://localhost:3000/profile")

    # test form for uploading CV appears when clicking 'Add CV' link
    about_link = driver.find_element("xpath", '//a[text()="Add Cv"]')
    about_link.click()
    
    submit_button = driver.find_element("xpath", '//button[text()="Submit"]')
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of(submit_button))
    
    assert submit_button.is_displayed(), "Submit button is not displayed on the Add CV page"