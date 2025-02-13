
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from selenium_tests.test_base import BaseTest
from selenium_tests.pages.login_page import LoginPage
from selenium_tests.pages.home_page import HomePage
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

if __name__ == "__main__":
    unittest.main()