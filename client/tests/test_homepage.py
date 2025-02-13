import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time 

# Fixture לניהול WebDriver
@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    time.sleep(5)
    driver.quit()

# בדיקה 1: טעינת עמוד הבית
def test_homepage_load(driver):
    driver.get("https://localhost:5173")
    assert "Spotify" in driver.title, "Page title does not contain 'Spotify'"
    print("Homepage loaded successfully with title containing 'Spotify'")

# בדיקה 2: בדיקת URL של עמוד הבית
def test_homepage_url(driver):
    driver.get("https://localhost:5173")
    assert driver.current_url == "https://localhost:5173", "Homepage URL is incorrect"
    print("Homepage URL is correct")


    