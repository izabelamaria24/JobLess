from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from login import *

def test_upload_cv_button(driver):
    login(driver)
    driver.get("http://localhost:3000/applications/2")
    wait = WebDriverWait(driver, 10)

    # Wait for and click the 'Add Response' link                                    
    add_response_link = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[text()="Add Response"]')))
    add_response_link.click()

    # Wait for the 'Submit' button to be visible
    submit_button = wait.until(EC.visibility_of_element_located((By.XPATH, '//button[text()="Submit"]')))

    # Final assertion
    assert submit_button.is_displayed(), "Submit button is not displayed on the Add Response page"