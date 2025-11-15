/**
 * Demo Application Data Generator
 * This script provides sample data for testing the membership application form
 */

export const demoApplicationData = {
  // Primary applicant details
  fullName: "Rajesh Kumar Sharma",
  address: "123, MG Road, Jayanagar 4th Block, Near BDA Complex, Bangalore",
  phone: "9876543210",
  aadharNumber: "123456789012",
  pincode: "560041",
  city: "Bangalore",
  state: "Karnataka",
  
  // Family members
  familyMembers: [
    {
      name: "Priya Sharma",
      age: "35",
      relation: "Wife"
    },
    {
      name: "Arjun Sharma",
      age: "12",
      relation: "Son"
    },
    {
      name: "Ananya Sharma",
      age: "8",
      relation: "Daughter"
    }
  ],
  
  // Donation amount
  donationAmount: 1000,
  
  // Status
  status: "pending"
};

export const demoApplicationData2 = {
  fullName: "Lakshmi Devi",
  address: "45, Temple Street, Malleshwaram, Near Circle, Bangalore",
  phone: "9123456789",
  aadharNumber: "987654321098",
  pincode: "560003",
  city: "Bangalore",
  state: "Karnataka",
  familyMembers: [
    {
      name: "Venkatesh Rao",
      age: "58",
      relation: "Husband"
    },
    {
      name: "Meera Rao",
      age: "28",
      relation: "Daughter"
    }
  ],
  donationAmount: 1000,
  status: "approved"
};

export const demoApplicationData3 = {
  fullName: "Suresh Babu",
  address: "78, Residency Road, Richmond Town, Bangalore",
  phone: "8765432109",
  aadharNumber: "456789123456",
  pincode: "560025",
  city: "Bangalore",
  state: "Karnataka",
  familyMembers: [],
  donationAmount: 1000,
  status: "rejected"
};

/**
 * Function to auto-fill the application form with demo data
 * Call this from the browser console when on the /apply page
 */
export const fillDemoApplication = (dataSet: typeof demoApplicationData = demoApplicationData) => {
  // Fill text inputs
  const fillInput = (selector: string, value: string) => {
    const input = document.querySelector(selector) as HTMLInputElement;
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // Fill form fields
  fillInput('input[placeholder*="Full Name"]', dataSet.fullName);
  fillInput('textarea[placeholder*="Address"]', dataSet.address);
  fillInput('input[placeholder*="Phone"]', dataSet.phone);
  fillInput('input[placeholder*="Aadhar"]', dataSet.aadharNumber);
  fillInput('input[placeholder*="Pincode"]', dataSet.pincode);
  fillInput('input[placeholder*="City"]', dataSet.city);
  fillInput('input[placeholder*="State"]', dataSet.state);

  console.log('✅ Demo application data filled!');
  console.log('Note: You need to upload Aadhar card and passport photo manually or use the test files.');
};

// Make it available globally in browser console
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).fillDemoApplication = fillDemoApplication;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).demoApplicationData = demoApplicationData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).demoApplicationData2 = demoApplicationData2;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).demoApplicationData3 = demoApplicationData3;
}
