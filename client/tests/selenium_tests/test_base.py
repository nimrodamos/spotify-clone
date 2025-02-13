import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import os

class BaseTest(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--ignore-ssl-errors')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Get the absolute path to chromedriver.exe
        driver_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            "drivers",
            "chromedriver.exe"
        ))
        
        try:
            service = Service(executable_path=driver_path)
            self.driver = webdriver.Chrome(
                service=service,
                options=chrome_options
            )
            self.driver.maximize_window()
            self.driver.get("https://localhost:5173/login")
            
        except Exception as e:
            print(f"Error initializing WebDriver: {str(e)}")
            print(f"Driver path: {driver_path}")  # Debug print
            raise

    def tearDown(self):
        if hasattr(self, 'driver'):
            self.driver.quit()