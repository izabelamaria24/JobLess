from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from login_credentials import *

def login(driver, username = USR, password = PSW):
    driver.get("http://localhost:3000/login")
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "email"))).send_keys(username)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "password"))).send_keys(password)
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[text()="Login"]'))).click()
    # Wait for login to complete (adjust selector as needed)
    WebDriverWait(driver, 10).until(EC.url_changes("http://localhost:3000/login"))
