from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage
import time

class LoginPage(BasePage):
    # Simplified selectors
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button.w-\\[100\\%\\].py-\\[0\\.85rem\\].bg-green-500")

    def login(self, email, password):
        try:
            print("\nStarting login process...")
            # Add a wait for page load
            time.sleep(2)

            # Find and fill email
            print("Looking for email input...")
            email_input = self.driver.find_element(*self.EMAIL_INPUT)
            print("Found email input, clearing...")
            email_input.clear()
            print(f"Entering email: {email}")
            email_input.send_keys(email)
            print("Email entered")

            # Find and fill password
            print("Looking for password input...")
            password_input = self.driver.find_element(*self.PASSWORD_INPUT)
            print("Found password input, clearing...")
            password_input.clear()
            print("Entering password...")
            password_input.send_keys(password)
            print("Password entered")

            # Find and click login button
            print("Looking for login button...")
            login_button = self.driver.find_element(*self.LOGIN_BUTTON)
            print("Found login button, clicking...")
            login_button.click()
            print("Login button clicked")

            # Wait for navigation
            time.sleep(3)
            print(f"Current URL after login: {self.driver.current_url}")

            # Take screenshot after login attempt
            self.driver.save_screenshot("after_login_attempt.png")

            # Check for navigation
            if "/login" not in self.driver.current_url:
                print("Successfully navigated away from login page")
                return True
            else:
                print("Still on login page - login might have failed")
                return False

        except Exception as e:
            print(f"Login failed with error: {str(e)}")
            self.driver.save_screenshot("login_error.png")
            return False

    def is_login_successful(self):
        try:
            time.sleep(2)
            current_url = self.driver.current_url
            print(f"Checking login success. Current URL: {current_url}")
            return "/login" not in current_url
        except Exception as e:
            print(f"Error checking login status: {str(e)}")
            return False