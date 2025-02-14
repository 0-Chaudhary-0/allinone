document.addEventListener("DOMContentLoaded", async function () {
    var tokenElement = document.getElementById("jwt-token");

    if (tokenElement) {
        var accessToken = tokenElement.getAttribute("data-access-token");
        var refreshToken = tokenElement.getAttribute("data-refresh-token");

        if (accessToken && refreshToken) {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            console.log("🚀 Tokens stored successfully!");
        }
    }

    // Check if token is expired and refresh if needed
    await checkAndRefreshToken();
});

// Function to check if token is expired and refresh if needed
async function checkAndRefreshToken() {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        console.log("🔄 Token expired or missing, refreshing...");
        await refreshToken();
    }
}

// Function to refresh the token
async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        console.log("⚠ No refresh token found, redirecting to login...");
        window.location.href = "/login";
        return null;
    }

    try {
        const response = await fetch("/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (!data.accessToken) {
                console.error("❌ No accessToken received from server!");
                return null;
            }

            localStorage.setItem("token", data.accessToken);
            console.log("✅ Token refreshed successfully:", data.accessToken);
            return data.accessToken;
        } else {
            console.log("❌ Refresh token expired, redirecting to login...");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return null;
        }
    } catch (error) {
        console.error("❌ Error refreshing token:", error);
        window.location.href = "/login";
        return null;
    }
}

// Function to check if a token is expired
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Assume expired if there's an error
    }
}
