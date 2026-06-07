$pngPath = "C:\Users\Admin\.gemini\antigravity\brain\22ffc095-424b-4f75-842d-98c722e7847a\miku_icon_gen_1780813698618.png"
$icoPath = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app\sakura_icon.ico"
$batPath = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app\Sakura_Nihongo_Quiz.bat"

# 1. Convert PNG to 32-bit true-color ICO (direct header wrapping)
try {
    $pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
    $pngSize = $pngBytes.Length

    # Create the 22-byte ICO header
    $icoHeader = New-Object byte[] 22
    $icoHeader[0] = 0; $icoHeader[1] = 0   # Reserved
    $icoHeader[2] = 1; $icoHeader[3] = 0   # Type (1 = Icon)
    $icoHeader[4] = 1; $icoHeader[5] = 0   # Count (1 image)

    # Directory entry
    $icoHeader[6] = 0                      # Width (0 means 256)
    $icoHeader[7] = 0                      # Height (0 means 256)
    $icoHeader[8] = 0                      # Color count (0 = >=8bpp)
    $icoHeader[9] = 0                      # Reserved

    $icoHeader[10] = 1; $icoHeader[11] = 0  # Color planes (1)
    $icoHeader[12] = 32; $icoHeader[13] = 0 # Bits per pixel (32-bit)

    # Image size (4 bytes, little endian)
    $sizeBytes = [System.BitConverter]::GetBytes([uint32]$pngSize)
    $icoHeader[14] = $sizeBytes[0]
    $icoHeader[15] = $sizeBytes[1]
    $icoHeader[16] = $sizeBytes[2]
    $icoHeader[17] = $sizeBytes[3]

    # Image offset (4 bytes, little-endian, always 22)
    $icoHeader[18] = 22
    $icoHeader[19] = 0
    $icoHeader[20] = 0
    $icoHeader[21] = 0

    # Write combined bytes
    $fileStream = [System.IO.File]::Create($icoPath)
    $fileStream.Write($icoHeader, 0, $icoHeader.Length)
    $fileStream.Write($pngBytes, 0, $pngBytes.Length)
    $fileStream.Close()
    
    write-output "Successfully created 32-bit true-color ICO at $icoPath"
} catch {
    write-error "Failed to create ICO: $($_.Exception.Message)"
    exit 1
}

# 2. Create Desktop Shortcut Function
function Create-Shortcut {
    param(
        [string]$DesktopPath,
        [string]$ShortcutName
    )
    
    $shortcutPath = Join-Path $DesktopPath "$ShortcutName.lnk"
    
    try {
        $wshShell = New-Object -ComObject WScript.Shell
        $shortcut = $wshShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $batPath
        $shortcut.WorkingDirectory = "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app"
        $shortcut.IconLocation = "$icoPath,0"
        $shortcut.Description = "Sakura Nihongo Quiz Launcher"
        $shortcut.Save()
        
        write-output "Created shortcut with custom icon at $shortcutPath"
    } catch {
        write-error "Failed to create shortcut at $shortcutPath : $($_.Exception.Message)"
    }
}

# Apply to all desktop locations to update icon
$desktop1 = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)
Create-Shortcut -DesktopPath $desktop1 -ShortcutName "Sakura_Nihongo_Quiz"

$desktop2 = "C:\Users\Admin\Desktop"
if (Test-Path $desktop2) {
    Create-Shortcut -DesktopPath $desktop2 -ShortcutName "Sakura_Nihongo_Quiz"
}

$desktop3 = "C:\Users\Admin\OneDrive\Desktop"
if (Test-Path $desktop3) {
    Create-Shortcut -DesktopPath $desktop3 -ShortcutName "Sakura_Nihongo_Quiz"
}

$desktop4 = "C:\Users\Public\Desktop"
if (Test-Path $desktop4) {
    Create-Shortcut -DesktopPath $desktop4 -ShortcutName "Sakura_Nihongo_Quiz"
}
