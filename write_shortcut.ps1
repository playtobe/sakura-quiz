$content = @"
@echo off
title Sakura Nihongo Quiz
cd /d "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app"
start "" "index.html"
exit
"@

# Path 1: Default SpecialFolder Desktop
$desktop1 = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)
$path1 = Join-Path $desktop1 "Sakura_Nihongo_Quiz.bat"
Try {
    [System.IO.File]::WriteAllText($path1, $content)
    write-output "Wrote to: $path1"
} Catch {}

# Path 2: Classic user desktop
$path2 = "C:\Users\Admin\Desktop\Sakura_Nihongo_Quiz.bat"
Try {
    [System.IO.File]::WriteAllText($path2, $content)
    write-output "Wrote to: $path2"
} Catch {}

# Path 3: OneDrive English Desktop
$path3 = "C:\Users\Admin\OneDrive\Desktop\Sakura_Nihongo_Quiz.bat"
Try {
    [System.IO.File]::WriteAllText($path3, $content)
    write-output "Wrote to: $path3"
} Catch {}

# Path 4: Public Desktop (All Users)
$path4 = "C:\Users\Public\Desktop\Sakura_Nihongo_Quiz.bat"
Try {
    [System.IO.File]::WriteAllText($path4, $content)
    write-output "Wrote to: $path4"
} Catch {}
