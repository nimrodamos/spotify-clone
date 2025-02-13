from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage
from ..config import TestConfig
import time
import os

class HomePage(BasePage):
    # Locators
    SEARCH_BAR = (By.CSS_SELECTOR, "input[placeholder='What do you want to play?']")
    SEARCH_RESULTS = (By.CSS_SELECTOR, ".search-results") 
    PROFILE_BUTTON = (By.CSS_SELECTOR, "div[class*='rounded-full cursor-pointer']")
    LSB_TOGGLE = (By.CSS_SELECTOR, "div[class='h-full bg-[#121212] rounded transition-all duration-300 overflow-hidden']")
    PLAY_BUTTON = (By.CSS_SELECTOR, "button[class*='bg-green-500']")
    PAUSE_BUTTON = (By.CSS_SELECTOR, "svg[class*='IoIosPause']")
    SONG_ITEM = (By.CSS_SELECTOR, "div[class*='group flex items-center justify-between']")
    HOME_CONTENT = (By.CSS_SELECTOR, "div[class='min-h-full w-full text-white']")
    FILTER_BUTTONS = (By.CSS_SELECTOR, "button[class*='py-1 px-3 rounded-full transition']")
    SONG_ITEMS = (By.CSS_SELECTOR, "div[class*='group flex items-center justify-between']")
    USER_AVATAR = (By.XPATH, "//*[@id='root']/div/div[1]/nav/div[3]/span")
    USER_DROPDOWN_MENU = (By.XPATH, "//*[@id='root']/div/div[1]/nav/div[3]/div")
    PROFILE_DROPDOWN_OPTION = (By.XPATH, "//*[@id='root']/div/div[1]/nav/div[3]/div/ul/li[2]")
 
    def search_song(self, song_name):
        try:
            print(f"\nAttempting to search for song: {song_name}")
            
            # Wait for search bar to be present
            print("Waiting for search bar...")
            search_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located(self.SEARCH_BAR)
            )
            
            # Clear and enter search text
            print("Entering search text...")
            search_input.clear()
            time.sleep(1)  # Small pause after clear
            search_input.send_keys(song_name)
            time.sleep(1)  # Small pause before Enter
            search_input.send_keys(Keys.RETURN)
            
            # Take screenshot of search results
            time.sleep(2)  # Wait for results to load
            self.driver.save_screenshot("search_results.png")
            
            # Wait for any song item to appear
            print("Waiting for search results...")
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(self.SONG_ITEMS)
                )
                print("Search results found")
                return True
            except:
                print("No search results found")
                return False

        except Exception as e:
            print(f"Search failed with error: {str(e)}")
            self.driver.save_screenshot("search_error.png")
            return False

    def verify_search_results(self):
        """Additional method to verify search results"""
        try:
            results = self.driver.find_elements(*self.SONG_ITEMS)
            print(f"Found {len(results)} search results")
            return len(results) > 0
        except:
            print("Could not find any search results")
            return False

    def navigate_to_profile(self):
        try:
            print("\nStarting profile navigation...")
            
            # Take screenshot of initial state
            screenshot_path = "pre_navigation_state.png"
            self.driver.save_screenshot(screenshot_path)
            print(f"Screenshot saved to {os.path.abspath(screenshot_path)}")
            
            # Wait and click on the user avatar
            print("Attempting to find and click user avatar...")
            avatar = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable(self.USER_AVATAR)
            )
            avatar.click()
            print("User avatar clicked")
            
            # Wait for dropdown to be visible
            WebDriverWait(self.driver, 10).until(
                EC.visibility_of_element_located(self.USER_DROPDOWN_MENU)
            )
            
            # Take screenshot of dropdown
            dropdown_screenshot = "dropdown_state.png"
            self.driver.save_screenshot(dropdown_screenshot)
            print(f"Dropdown screenshot saved to {os.path.abspath(dropdown_screenshot)}")
            
            # Find and click Profile option
            print("Searching for Profile option...")
            profile_option = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable(self.PROFILE_DROPDOWN_OPTION)
            )
            profile_option.click()
            print("Profile option clicked")
            
            # Wait for navigation to complete
            time.sleep(2)
            
            # Detailed URL logging
            current_url = self.driver.current_url
            print(f"Current URL: {current_url}")
            print(f"Expected Profile URL: {TestConfig.PROFILE_URL}")
            
            # Take screenshot after navigation
            final_screenshot = "post_navigation_state.png"
            self.driver.save_screenshot(final_screenshot)
            print(f"Final screenshot saved to {os.path.abspath(final_screenshot)}")
            
            # Check if we've reached the profile page
            profile_navigation_success = TestConfig.PROFILE_URL in current_url
            print(f"Profile navigation success: {profile_navigation_success}")
            
            return profile_navigation_success
        
        except Exception as e:
            print(f"Profile navigation failed with error: {str(e)}")
            
            # Take error screenshot
            error_screenshot = "profile_navigation_error.png"
            self.driver.save_screenshot(error_screenshot)
            print(f"Error screenshot saved to {os.path.abspath(error_screenshot)}")
            
            # Print additional debug information
            print("Page source at error:")
            print(self.driver.page_source[:2000])
            
            return False
    def toggle_lsb(self):
        """
        Toggle left sidebar and verify state change
        """
        try:
            initial_width = self.find_element(self.LSB_TOGGLE).size['width']
            self.click_element(self.LSB_TOGGLE)
            final_width = self.find_element(self.LSB_TOGGLE).size['width']
            return initial_width != final_width
        except Exception as e:
            print(f"LSB toggle failed: {str(e)}")
            return False

    def play_pause_song(self):
        """
        Play and pause a song, verifying state changes
        """
        try:
            # Find and click the first song's play button
            song = self.find_element(self.SONG_ITEM)
            play_button = song.find_element(*self.PLAY_BUTTON)
            play_button.click()
            
            # Verify pause button appears (song is playing)
            is_playing = self.is_element_visible(self.PAUSE_BUTTON)
            if is_playing:
                # Click pause button
                pause_button = self.find_element(self.PAUSE_BUTTON)
                pause_button.click()
            
            return is_playing
        except Exception as e:
            print(f"Play/Pause operation failed: {str(e)}")
            return False

    def verify_home_loaded(self):
        """
        Verify home page is loaded successfully
        """
        return self.is_element_visible(self.HOME_CONTENT)

    def click_filter(self, filter_name):
        """
        Click a specific filter button
        """
        try:
            filters = self.driver.find_elements(*self.FILTER_BUTTONS)
            for filter_button in filters:
                if filter_button.text.lower() == filter_name.lower():
                    filter_button.click()
                    return True
            return False
        except Exception as e:
            print(f"Filter click failed: {str(e)}")
            return False

    def is_content_filtered(self, filter_name):
        """
        Verify content is filtered correctly
        """
        # Add specific verification logic based on your UI
        try:
            # Example: check if selected filter button has the correct class
            filters = self.driver.find_elements(*self.FILTER_BUTTONS)
            for filter_button in filters:
                if filter_button.text.lower() == filter_name.lower():
                    return "bg-[#ffff] text-black" in filter_button.get_attribute("class")
            return False
        except Exception as e:
            print(f"Filter verification failed: {str(e)}")
            return False