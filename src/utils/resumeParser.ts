export interface ExtractedData {
  name?: string;
  email?: string;
  phone?: string;
}

export async function parseResume(file: File): Promise<ExtractedData> {
  // Mock resume parsing - in real implementation, you'd use a library like pdf-parse
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      
      // Simple mock extraction
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
      const phoneRegex = /(\+?[\d\s\-\(\)\.]{10,})/;
      
      const emailMatch = text.match(emailRegex);
      const phoneMatch = text.match(phoneRegex);
      
      // Mock name extraction (first line that looks like a name)
      const lines = text.split('\n').filter(line => line.trim());
      let name = '';
      
      for (const line of lines.slice(0, 5)) {
        if (line.length > 5 && line.length < 50 && !line.includes('@') && !phoneRegex.test(line)) {
          name = line.trim();
          break;
        }
      }
      
      resolve({
        name: name || undefined,
        email: emailMatch?.[1] || undefined,
        phone: phoneMatch?.[1] || undefined
      });
    };
    
    // For PDF files, this would need actual PDF parsing
    if (file.type === 'application/pdf') {
      // Mock PDF content
      reader.readAsText(new Blob(['John Doe\njohn.doe@email.com\n+1 (555) 123-4567\nSoftware Developer...'], { type: 'text/plain' }));
    } else {
      reader.readAsText(file);
    }
  });
}