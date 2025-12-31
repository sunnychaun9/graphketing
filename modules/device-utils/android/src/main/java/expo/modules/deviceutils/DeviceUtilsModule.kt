package expo.modules.deviceutils

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DeviceUtilsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DeviceUtils")

    // Custom vibration pattern function
    Function("vibratePattern") { pattern: List<Long>, repeat: Int ->
      val context = appContext.reactContext ?: return@Function false
      val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vibratorManager.defaultVibrator
      } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      }

      if (!vibrator.hasVibrator()) {
        return@Function false
      }

      val patternArray = pattern.toLongArray()
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createWaveform(patternArray, repeat))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(patternArray, repeat)
      }
      true
    }

    // Success vibration pattern
    Function("vibrateSuccess") {
      val pattern = listOf(0L, 50L, 50L, 50L)
      vibrateWithPattern(pattern)
    }

    // Error vibration pattern
    Function("vibrateError") {
      val pattern = listOf(0L, 100L, 50L, 100L, 50L, 100L)
      vibrateWithPattern(pattern)
    }

    // Cancel vibration
    Function("cancelVibration") {
      val context = appContext.reactContext ?: return@Function
      val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vibratorManager.defaultVibrator
      } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
      }
      vibrator.cancel()
    }

    // Get device storage info
    Function("getStorageInfo") {
      val stat = StatFs(Environment.getDataDirectory().path)
      val totalBytes = stat.blockCountLong * stat.blockSizeLong
      val availableBytes = stat.availableBlocksLong * stat.blockSizeLong
      val usedBytes = totalBytes - availableBytes

      mapOf(
        "totalBytes" to totalBytes,
        "availableBytes" to availableBytes,
        "usedBytes" to usedBytes,
        "totalGB" to String.format("%.2f", totalBytes / (1024.0 * 1024.0 * 1024.0)),
        "availableGB" to String.format("%.2f", availableBytes / (1024.0 * 1024.0 * 1024.0)),
        "usedGB" to String.format("%.2f", usedBytes / (1024.0 * 1024.0 * 1024.0)),
        "usedPercentage" to String.format("%.1f", (usedBytes.toDouble() / totalBytes.toDouble()) * 100)
      )
    }

    // Get device info
    Function("getDeviceInfo") {
      mapOf(
        "brand" to Build.BRAND,
        "model" to Build.MODEL,
        "device" to Build.DEVICE,
        "sdkVersion" to Build.VERSION.SDK_INT,
        "androidVersion" to Build.VERSION.RELEASE
      )
    }
  }

  private fun vibrateWithPattern(pattern: List<Long>) {
    val context = appContext.reactContext ?: return
    val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
      vibratorManager.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }

    if (!vibrator.hasVibrator()) return

    val patternArray = pattern.toLongArray()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(patternArray, -1))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(patternArray, -1)
    }
  }
}
