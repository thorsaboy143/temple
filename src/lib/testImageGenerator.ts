/**
 * Test Image Generator
 * Creates placeholder images for testing document uploads
 */

/**
 * Generate a test Aadhar card image using Canvas API
 */
export const generateTestAadharCard = (): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, 780, 480);

    // Logo area
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(30, 30, 150, 80);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('AADHAAR', 45, 75);

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('DEMO AADHAAR CARD', 220, 80);

    // Photo placeholder
    ctx.fillStyle = '#ddd';
    ctx.fillRect(50, 130, 150, 180);
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.fillText('PHOTO', 95, 225);

    // Details
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.fillText('Name: Rajesh Kumar Sharma', 220, 150);
    ctx.fillText('DOB: 15/01/1985', 220, 190);
    ctx.fillText('Gender: Male', 220, 230);
    ctx.fillText('Address: 123, MG Road', 220, 270);
    ctx.fillText('         Bangalore - 560041', 220, 300);
    
    // Aadhar number
    ctx.font = 'bold 28px Courier New';
    ctx.fillText('1234 5678 9012', 220, 360);

    // Footer
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(30, 420, 740, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('FOR TESTING PURPOSES ONLY - NOT A REAL DOCUMENT', 100, 450);

    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

/**
 * Generate a test passport photo using Canvas API
 */
export const generateTestPassportPhoto = (): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 600);

    // Simple face representation
    // Head circle
    ctx.fillStyle = '#f4c2a4';
    ctx.beginPath();
    ctx.arc(300, 250, 120, 0, 2 * Math.PI);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#2c2c2c';
    ctx.beginPath();
    ctx.arc(300, 200, 130, Math.PI, 2 * Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2c2c2c';
    ctx.beginPath();
    ctx.arc(270, 240, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(330, 240, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 280, 30, 0, Math.PI);
    ctx.stroke();

    // Body/Shoulders
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(180, 370, 240, 200);

    // Text
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.fillText('DEMO PASSPORT PHOTO', 200, 550);
    ctx.fillText('For Testing Only', 230, 580);

    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

/**
 * Download generated test images
 */
export const downloadTestImages = async () => {
  // Generate Aadhar card
  const aadharBlob = await generateTestAadharCard();
  const aadharUrl = URL.createObjectURL(aadharBlob);
  const aadharLink = document.createElement('a');
  aadharLink.href = aadharUrl;
  aadharLink.download = 'test-aadhar-card.png';
  aadharLink.click();
  URL.revokeObjectURL(aadharUrl);

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate passport photo
  const photoBlob = await generateTestPassportPhoto();
  const photoUrl = URL.createObjectURL(photoBlob);
  const photoLink = document.createElement('a');
  photoLink.href = photoUrl;
  photoLink.download = 'test-passport-photo.png';
  photoLink.click();
  URL.revokeObjectURL(photoUrl);
};

// Make available in browser console
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).generateTestAadharCard = generateTestAadharCard;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).generateTestPassportPhoto = generateTestPassportPhoto;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).downloadTestImages = downloadTestImages;
}
