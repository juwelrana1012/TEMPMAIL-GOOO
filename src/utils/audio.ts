// Sound system completely muted / disabled as requested.
// All clicks, copies, and UI interactions are 100% silent.

class SoundEffects {
  // Silent click
  playClick(): void {
    // Disabled - completely silent
  }

  // Silent copy chime
  playSuccessChime(): void {
    // Disabled - completely silent
  }

  // Silent premium copy chime
  playPremiumCopyChime(): void {
    // Disabled - completely silent
  }

  // Silent chime
  playZinZinChime(): void {
    // Disabled - completely silent
  }

  // Silent copy success
  playCopySuccess(): void {
    // Disabled - completely silent
  }

  // Silent cover burst
  playCoverBurst(): void {
    // Disabled - completely silent
  }

  // Silent word rise
  playWordRise(_index: number = 0): void {
    // Disabled - completely silent
  }

  // Silent letter drop
  playLetterDrop(_index: number = 0): void {
    // Disabled - completely silent
  }

  // Silent intro enter
  playIntroEnter(): void {
    // Disabled - completely silent
  }
}

export const sounds = new SoundEffects();
