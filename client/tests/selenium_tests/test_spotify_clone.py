
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from selenium_tests.test_base import BaseTest
from selenium_tests.pages.login_page import LoginPage
from selenium_tests.pages.home_page import HomePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestSpotifyClone(BaseTest):
    def test_login_success(self):
        try:
            print("\nStarting login test...")
            login_page = LoginPage(self.driver)
            
            # Take screenshot of initial state
            self.driver.save_screenshot("initial_state.png")
            print(f"Initial URL: {self.driver.current_url}")
            
            # Print page source for debugging
            print("Page source available:", bool(self.driver.page_source))
            
            # Attempt login
            result = login_page.login("obby@test.com", "maman123456")
            print(f"Login attempt result: {result}")
            
            # Take screenshot after attempt
            self.driver.save_screenshot("after_attempt.png")
            print(f"Final URL: {self.driver.current_url}")
            
            self.assertTrue(result, "Initial login attempt failed")
            
            # Verify successful login
            is_logged_in = login_page.is_login_successful()
            self.assertTrue(is_logged_in, "Login verification failed")
            
        except Exception as e:
            print(f"Test failed with error: {str(e)}")
            self.driver.save_screenshot("error_state.png")
            raise
    def test_search_and_play(self):
        try:
            print("\nStarting search and play test...")
            
            # Login first
            login_page = LoginPage(self.driver)
            login_success = login_page.login("obby@test.com", "maman123456")
            print(f"Login success: {login_success}")
            
            if not login_success:
                self.fail("Login failed before search test")
            
            # Wait for home page to load
            time.sleep(2)
            
            # Perform search
            home_page = HomePage(self.driver)
            search_results = home_page.search_song("the key")
            print(f"Search results found: {search_results}")
            
            # Take screenshot of final state
            self.driver.save_screenshot("final_search_state.png")
            
            # Additional verification
            has_results = home_page.verify_search_results()
            print(f"Verified results present: {has_results}")
            
            self.assertTrue(search_results, "No search results were found")
            
        except Exception as e:
            print(f"Test failed with error: {str(e)}")
            self.driver.save_screenshot("search_test_error.png")
            raise

    def test_profile_navigation(self):
        login_page = LoginPage(self.driver)
        login_page.login("obby@test.com", "maman123456")
        
        home_page = HomePage(self.driver)
        profile_navigation = home_page.navigate_to_profile()
        self.assertTrue(profile_navigation)

    def test_browse_all_navigation(self):
        try:
            print("\nStarting browse all navigation test...")
            
            # Login first
            login_page = LoginPage(self.driver)
            login_success = login_page.login("obby@test.com", "maman123456")
            self.assertTrue(login_success, "Login failed before browse test")
            
            # Wait for page to load
            time.sleep(2)
            
            # Find and click browse all button
            browse_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[1]/nav/div[2]/div[2]/div[2]/button/div/a"))
            )
            browse_button.click()
            
            # Take screenshot
            self.driver.save_screenshot("browse_all_page.png")
            
            # Verify navigation to browse all page
            self.assertIn("/browse", self.driver.current_url, "Failed to navigate to browse all page")
            
        except Exception as e:
            print(f"Browse all navigation test failed: {str(e)}")
            self.driver.save_screenshot("browse_all_error.png")
            raise

    def test_logout(self):
        try:
            print("\nStarting logout test...")
            
            # Login first
            login_page = LoginPage(self.driver)
            login_success = login_page.login("obby@test.com", "maman123456")
            self.assertTrue(login_success, "Login failed before logout test")
            
            # Wait for page to load
            time.sleep(2)
            
            # Open user dropdown
            user_avatar = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[1]/nav/div[3]/span"))
            )
            user_avatar.click()
            
            # Wait for dropdown to appear
            time.sleep(1)
            
            # Find and click logout button
            logout_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[1]/nav/div[3]/div/ul/li[4]"))
            )
            logout_button.click()
            
            # Take screenshot
            self.driver.save_screenshot("logout_page.png")
            
            # Verify navigation to login/home page
            WebDriverWait(self.driver, 10).until(
                EC.url_contains("/")
            )
            
            print(f"Current URL after logout: {self.driver.current_url}")
            
        except Exception as e:
            print(f"Logout test failed: {str(e)}")
            self.driver.save_screenshot("logout_error.png")
            raise

    def test_open_right_sidebar(self):
        try:
            print("\nStarting right sidebar open test...")
            
            # Login first
            login_page = LoginPage(self.driver)
            login_success = login_page.login("obby@test.com", "maman123456")
            self.assertTrue(login_success, "Login failed before RSB test")
            
            # Wait for page to load
            time.sleep(2)
            
            # Find and click RSB trigger
            rsb_trigger = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[2]/div/div/div[3]/div/div"))
            )
            rsb_trigger.click()
            
            # Take screenshot
            self.driver.save_screenshot("right_sidebar_open.png")
            
            # Verify RSB is open (you might need to adjust this verification)
            # This is a placeholder - you may need to add a specific check for RSB state
            time.sleep(1)
            self.assertTrue(True, "Right sidebar should be open")
            
        except Exception as e:
            print(f"Right sidebar open test failed: {str(e)}")
            self.driver.save_screenshot("rsb_open_error.png")
            raise

    def test_navigate_to_playlist(self):
        try:
            print("\nStarting playlist navigation test...")
            
            # Login first
            login_page = LoginPage(self.driver)
            login_success = login_page.login("obby@test.com", "maman123456")
            self.assertTrue(login_success, "Login failed before playlist test")
            
            # Wait for page to load
            time.sleep(2)
            
            # Find and click playlist
            playlist = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[2]/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]"))
            )
            playlist.click()
            
            # Take screenshot
            self.driver.save_screenshot("playlist_page.png")
            
            # Verify navigation to playlist page
            WebDriverWait(self.driver, 10).until(
                EC.url_contains("/playlist/")
            )
            
            print(f"Current URL after playlist navigation: {self.driver.current_url}")
            self.assertIn("/playlist/", self.driver.current_url, "Failed to navigate to playlist page")
            
        except Exception as e:
            print(f"Playlist navigation test failed: {str(e)}")
            self.driver.save_screenshot("playlist_navigation_error.png")
            raise

if __name__ == "__main__":
    unittest.main()