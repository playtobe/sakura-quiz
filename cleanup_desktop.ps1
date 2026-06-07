# 1. Determine the active User Desktop (OneDrive or Local)
$activeDesktop = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)

# 2. Define all possible paths
$pathsToDelete = @(
    "C:\Users\Public\Desktop\Sakura_Nihongo_Quiz.lnk",
    "C:\Users\Public\Desktop\Sakura_Nihongo_Quiz.bat",
    "C:\Users\Admin\Desktop\Sakura_Nihongo_Quiz.lnk",
    "C:\Users\Admin\Desktop\Sakura_Nihongo_Quiz.bat"
)

# If the active desktop is OneDrive, also delete from the standard desktop folder to prevent duplicates
if ($activeDesktop -like "*OneDrive*") {
    $pathsToDelete += "C:\Users\Admin\Desktop\Sakura_Nihongo_Quiz.lnk"
    $pathsToDelete += "C:\Users\Admin\Desktop\Sakura_Nihongo_Quiz.bat"
} else {
    # If the active desktop is local, delete from OneDrive if it exists to prevent duplicates
    $pathsToDelete += "C:\Users\Admin\OneDrive\Desktop\Sakura_Nihongo_Quiz.lnk"
    $pathsToDelete += "C:\Users\Admin\OneDrive\Desktop\Sakura_Nihongo_Quiz.bat"
    $pathsToDelete += "C:\Users\Admin\OneDrive\Máy tính\Sakura_Nihongo_Quiz.lnk"
    $pathsToDelete += "C:\Users\Admin\OneDrive\Máy tính\Sakura_Nihongo_Quiz.bat"
}

# 3. Perform the deletion
foreach ($p in $pathsToDelete) {
    if (Test-Path $p) {
        Remove-Item $p -Force
        write-output "Deleted duplicate at $p"
    }
}

# 4. Make sure exactly one shortcut exists in the active desktop folder
$activeShortcut = Join-Path $activeDesktop "Sakura_Nihongo_Quiz.lnk"
$batPath = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app\Sakura_Nihongo_Quiz.bat"
$icoPath = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app\sakura_icon.ico"

# Recreate to ensure it is fresh and clean
$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($activeShortcut)
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app"
$shortcut.IconLocation = "$icoPath,0"
$shortcut.Description = "Sakura Nihongo Quiz Launcher"
$shortcut.Save()

write-output "Kept only single active shortcut at $activeShortcut"
