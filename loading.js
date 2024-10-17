// Create and set up the loading screen elements
const loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.style.position = 'absolute';
loadingScreen.style.top = '0';
loadingScreen.style.left = '0';
loadingScreen.style.width = '100%';
loadingScreen.style.height = '100%';
loadingScreen.style.background = '#000';
loadingScreen.style.display = 'flex';
loadingScreen.style.justifyContent = 'center';
loadingScreen.style.alignItems = 'center';
loadingScreen.style.color = '#fff';
loadingScreen.style.zIndex = '9999';

// Create the loading bar container
const loadingContainer = document.createElement('div');
loadingContainer.style.width = '80%';
loadingContainer.style.maxWidth = '600px';

// Create the loading text
const loadingText = document.createElement('div');
loadingText.id = 'loading-text';
loadingText.style.marginBottom = '10px';
loadingText.textContent = 'Loading... 0%';

// Create the progress bar background
const progressBarBackground = document.createElement('div');
progressBarBackground.style.background = '#444';
progressBarBackground.style.width = '100%';
progressBarBackground.style.height = '20px';
progressBarBackground.style.borderRadius = '5px';
progressBarBackground.style.overflow = 'hidden';

// Create the actual progress bar
const loadingBar = document.createElement('div');
loadingBar.id = 'loading-bar';
loadingBar.style.background = '#0f0';
loadingBar.style.width = '0%';
loadingBar.style.height = '100%';

// Append elements to build the loading screen structure
progressBarBackground.appendChild(loadingBar);
loadingContainer.appendChild(loadingText);
loadingContainer.appendChild(progressBarBackground);
loadingScreen.appendChild(loadingContainer);
document.body.appendChild(loadingScreen);

// Function to update the loading progress
function updateLoadingProgress(loadedTiles, totalTiles) {
    const progress = (loadedTiles / totalTiles) * 100;
    loadingText.textContent = `Loading... ${Math.floor(progress)}%`;
    loadingBar.style.width = `${progress}%`;

    // Hide the loading screen when fully loaded
    if (loadedTiles === totalTiles) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Add a slight delay before hiding the loading screen
    }
}

// Export the update function
export { updateLoadingProgress };
