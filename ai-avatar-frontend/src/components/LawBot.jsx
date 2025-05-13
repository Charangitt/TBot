import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF Report Component
// PDF Report Component
const ReportPDF = ({ reportData }) => {
    const styles = StyleSheet.create({
      page: {
        padding: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        position: 'relative'
      },
      section: {
        marginBottom: 15,
        borderBottom: '1px dotted #aaa',
        paddingBottom: 5
      },
      header: {
        fontSize: 20,
        marginBottom: 5,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        borderBottom: '2px solid black',
        paddingBottom: 5
      },
      policeHeader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold'
      },
      subheader: {
        fontSize: 16,
        marginBottom: 10,
        marginTop: 15,
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        padding: 5,
        borderRadius: 3
      },
      label: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 12,
        color: '#444'
      },
      text: {
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 11,
        lineHeight: 1.5
      },
      firInfo: {
        marginBottom: 20,
        marginTop: 15,
        borderBottom: '1px solid black',
        borderTop: '1px solid black',
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: '#f9f9f9'
      },
      firField: {
        flexDirection: 'row',
        marginBottom: 4 ,
      },
      firLabel: {
        width: '30%',
        // fontWeight: 'bold',
        fontSize: 11,
        paddingRight: 5
      },
      firValue: {
        width: '70%',
        fontSize: 11,
        borderBottom: '1px dotted #aaa'
      },
      watermark: {
        position: 'absolute',
        top: '40%',
        left: '25%',
        transform: 'rotate(-30deg)',
        opacity: 0.06,
        zIndex: -1
      },
      footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        borderTop: '1px solid black',
        paddingTop: 10,
        fontSize: 10,
        color: '#555',
        textAlign: 'center'
      },
      signaturesSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 3
      },
      signatureBox: {
        width: '45%',
        borderTop: '0.8px solid black',
        paddingTop: 5,
        fontSize: 10
      },
      stampBox: {
        position: 'absolute',
        bottom: 95,
        right: 40,
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#555',
        zIndex:-1,
        transform: [{ translateY: '-10%' }]
      },
      stampText: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555'
      },
      sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
        textDecoration: 'underline',
        // backgroundColor: '#eee',
        padding: 2,
        underline: true,
      },
      mainContent: {
        marginBottom: 60, // Space for footer and signatures
      },
      emblem: {
        position: 'absolute',
        top: 25,
        left: 30,
        width: 50,
        height: 50
      },
      headerContainer: {
        marginBottom: 10,
        borderBottom: '2px solid black',
        paddingBottom: 7
      },
      confidential: {
        position: 'absolute',
        top: 10,
        right: 30,
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
        transform: 'rotate(15deg)'
      },
      caseInfoTitle: {
        backgroundColor: '#000',
        color: '#fff',
        padding: 5,
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
      }
    });
  
    // Generate a random FIR number with specific format
    const firNumber = `FIR/${Math.floor(Math.random() * 1000)}/WSC/2025`;
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');
    const registrationDateTime = `${currentDate} at ${currentTime}`;
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Watermark */}
          {/* <View style={styles.watermark}>
            <Text
              style={{ width: 1000, height: 1000, opacity: 0.3 ,position: 'relative', fontSize:40}} 
            >CONFIDENTIAL</Text>
          </View> */}

          {/* Confidential Stamp */}
          {/* <Text style={styles.confidential}>CONFIDENTIAL</Text> */}
  
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.policeHeader}>GOVERNMENT OF INDIA</Text>
            {/* <Text style={styles.policeHeader}>MINISTRY OF HOME AFFAIRS</Text> */}
            <Text style={styles.header}>First Information Report (FIR)</Text>
            <Text style={{ textAlign: 'center', fontSize: 10, marginTop: 5, fontStyle: 'italic' }}>
              Under Section 154 Cr.P.C.
            </Text>
          </View>
          
          {/* FIR Details */}
          <View style={styles.firInfo}>
            <View style={styles.firField}>
              <Text style={styles.firLabel}>FIR Number:</Text>
              <Text style={styles.firValue}>{firNumber}</Text>
            </View>
            <View style={styles.firField}>
              <Text style={styles.firLabel}>Date & Time of FIR:</Text>
              <Text style={styles.firValue}>{registrationDateTime}</Text>
            </View>
            {/* <View style={styles.firField}>
              <Text style={styles.firLabel}>Police Station:</Text>
              <Text style={styles.firValue}>Women Safety Cell</Text>
            </View> */}
            <View style={styles.firField}>
              <Text style={styles.firLabel}>District/City:</Text>
              <Text style={styles.firValue}>Medhcal - Malkajgiri</Text>
            </View>
          </View>
  
          <View style={styles.mainContent}>
            
            {/* Complainant Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Complainant Information</Text>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ ...styles.firLabel, width: '100%' }}>&bull; Name: Priti sundar</Text>
                {/* <Text style={{ ...styles.text, marginBottom: 0, paddingLeft: 0 }}>________________</Text> */}
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ ...styles.firLabel, width: '100%' }}>&bull; Address: Kompally , Near Anu Furnitures</Text>
                {/* <Text style={{ ...styles.text, marginBottom: 0, paddingLeft: 0 }}>________________</Text> */}
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ ...styles.firLabel, width: '100%' }}>&bull; Contact Number: 6303660324</Text>
                {/* <Text style={{ ...styles.text, marginBottom: 0, paddingLeft: 0 }}>________________</Text> */}
              </View>
            </View>
            
            {/* Incident Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Incident Details</Text>
              
              <Text style={styles.label}>1. Incident Description:</Text>
              <Text style={styles.text}>&bull; {reportData.what_happened}</Text>
              
              <Text style={styles.label}>2. Duration of Violence/Abuse:</Text>
              <Text style={styles.text}>&bull; {reportData.duration || "Not specified"}</Text>
              
              <Text style={styles.label}>3. Nature of Injuries/Harm:</Text>
              <Text style={styles.text}>&bull; {reportData.injuries || "Not specified"}</Text>
            </View>
            
            {/* Legal Classification */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal Classification</Text>
              <Text style={styles.label}>Applicable IPC Sections:</Text>
              <Text style={styles.text}>&bull; {reportData.charges}</Text>
            </View>
            
            {/* Accused Details */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Accused Details</Text>
              <Text style={styles.label}>A. Description of Accused:</Text>
              <Text style={styles.text}>{reportData.description}</Text>
              
              <Text style={styles.label}>B. Relationship to Complainant:</Text>
              <Text style={styles.text}>{reportData.relationship || "Not specified"}</Text>
            </View> */}
          </View>
  
          {/* Action Taken */}
          {/* <View style={{ marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>5. Action Taken</Text>
            <Text style={styles.text}>
              Case registered and investigation has been initiated. Necessary steps are being taken to apprehend the accused and collect evidence.
            </Text>
          </View> */}
          
          
          {/* Signatures */}
          <View style={styles.signaturesSection}>
            <View style={styles.signatureBox}>
              <Text style = {{paddingLeft:17}}>Signature / Thumb Impression of Complainant</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={{paddingLeft:50}}>Signature of Officer-in-Charge</Text>
              <Text style={{ fontSize: 9, marginTop: 5 , paddingLeft:75}}>
                Station House Officer
              </Text>
              <Text style={{ fontSize: 9 , paddingLeft:50}}>
                Women Safety Cell, Central District
              </Text>
            </View>
          </View>
          
          {/* Official Stamp Area */}
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>OFFICIAL SEAL</Text>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              This is an official document of the Police Department. Unauthorized reproduction or tampering is a punishable offense.
            </Text>
            <Text style={{ marginTop: 5 }}>
              Page 1 of 1 | Document ID: {firNumber}-{currentDate.replace(/\//g, '')}
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

export default function LawBot({ lawBotMessages, setLawBotMessages, isLawBotThinking, lawBotInput, sendLawBotMessage, promptSuggestions }) {
  const [incidentAnalysis, setIncidentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentText, setIncidentText] = useState('');
  const [incidentDuration, setIncidentDuration] = useState('');
  const [incidentInjuries, setIncidentInjuries] = useState('');
  const [pdfReady, setPdfReady] = useState(false);
  const incidentInputRef = useRef(null);
  const GEMINI_API_KEY = 'AIzaSyB7zfk2kyOoRn8qe4D9MKbUSQwlzllJnG0';
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change or isThinking changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [lawBotMessages, isLawBotThinking, showIncidentForm]);

  // Function to analyze the incident using Gemini API
  const analyzeIncident = async (incidentText, duration, injuries) => {
    setIsAnalyzing(true);
    try {
      // Create the request body according to Gemini API format
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Analyze the following incident and extract:
                1. What happened (main incident details)
                2. Applicable IPC sections
                3. Description of the aggressor
                4. Relationship between aggressor and victim (if mentioned)
                
                Incident: ${incidentText}
                
                Additional details:
                - Duration of violence/abuse: ${duration}
                - Nature of injuries/harm: ${injuries}
                
                Format your response as JSON with these keys:
                {"what_happened": "", "police_sections_ipc": "", "description_of_the_aggressor": "", "relationship_to_victim": "", "duration": "${duration}", "injuries": "${injuries}"}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95
        }
      };

      // Make the API request
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify(requestBody),
      });
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Extract the text from the response
      const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No valid response data received from API');
      }
      
      // Extract JSON from the response text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from API response');
      }
      
      // Parse the JSON
      const data = JSON.parse(jsonMatch[0]);
      
      // Format data for report
      const reportData = {
        what_happened: data.what_happened || "Not available",
        charges: data.police_sections_ipc || data.applicable_ipc_sections || "Not available",
        description: data.description_of_the_aggressor || "Not available",
        relationship: data.relationship_to_victim || "Not available",
        duration: data.duration || duration || "Not available",
        injuries: data.injuries || injuries || "Not available"
      };
      
      setIncidentAnalysis(reportData);
      setPdfReady(true);
      
      // Add a user message to chat with the incident
      if (setLawBotMessages) {
        setLawBotMessages(prevMessages => [...prevMessages, { 
          isUser: true, 
          text: "I'd like to report an incident: " + incidentText 
        }]);
      }
      
      // Add a bot message with the analysis summary
      const botMessage = `
## Incident Analysis Complete

I've analyzed the incident and identified the following:

**What Happened:** ${reportData.what_happened}

**Duration of Violence/Abuse:** ${reportData.duration}

**Nature of Injuries/Harm:** ${reportData.injuries}

**Applicable IPC Sections:** ${reportData.charges}

**Description of Aggressor:** ${reportData.description}

**Relationship to Victim:** ${reportData.relationship || "Not specified"}

You can find the FIR format report with download option below.
      `;
      
      // Add bot message to chat
      if (setLawBotMessages) {
        setLawBotMessages(prevMessages => [...prevMessages, { isUser: false, text: botMessage }]);
      }
      
    } catch (error) {
      console.error('Error analyzing incident:', error);
      
      // Add error message to chat
      if (setLawBotMessages) {
        setLawBotMessages(prevMessages => [...prevMessages, { 
          isUser: false, 
          text: "I encountered an error while analyzing the incident. Please try again or describe the incident in more detail." 
        }]);
      }
      
    } finally {
      setIsAnalyzing(false);
      // We no longer close the form window
      // setShowIncidentForm(false);
    }
  };

  // Handle incident form submission
  const handleIncidentSubmit = () => {
    if (incidentText.trim() !== '') {
      // Now analyze the incident with all details
      analyzeIncident(incidentText, incidentDuration, incidentInjuries);
    }
  };

  // Render dynamic PDF component only when data is ready
  const RenderPDFDownload = () => {
    if (!incidentAnalysis) return null;
    
    return (
      <PDFDownloadLink 
        document={<ReportPDF reportData={incidentAnalysis} />}
        fileName="incident_report_fir.pdf"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {({ blob, url, loading, error }) => (
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Preparing FIR document...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download FIR Report</span>
              </>
            )}
          </div>
        )}
      </PDFDownloadLink>
    );
  };

  // Reset form state
  const resetForm = () => {
    setIncidentText('');
    setIncidentDuration('');
    setIncidentInjuries('');
    setIncidentAnalysis(null);
    setPdfReady(false);
    setShowIncidentForm(false);
  };

  // Submit another report
  const submitAnotherReport = () => {
    setIncidentText('');
    setIncidentDuration('');
    setIncidentInjuries('');
    setIncidentAnalysis(null);
    setPdfReady(false);
    // Keep the form open
  };

  return (
    <div className="flex flex-col h-full max-h-full"> {/* Main container with full height */}
      {/* Law Bot Chat Messages - Make this scrollable */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 bg-gray-50 custom-scrollbar"
      >
        {lawBotMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <p className="text-center">Ask me about women's safety laws, rights, or report an incident for analysis.</p>
          </div>
        ) : (
          <>
            {lawBotMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 mb-3 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-200 group-hover:text-white transition-colors duration-300"
    style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))" }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12h6"></path>
    <path d="M12 9v6"></path>
    <path d="M9 15l3 3 3-3"></path>
  </svg>
                  </div>
                )}
                
                <div
                  className={`py-2 px-3 rounded-lg max-w-[80%] ${
                    message.isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {message.isUser ? (
                    <p>{message.text}</p>
                  ) : (
                    <ReactMarkdown components={{
                      p: ({node, ...props}) => <p className="text-sm prose prose-sm max-w-none" {...props} />
                    }}>
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>

                {message.isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {isLawBotThinking && (
          <div className="flex items-start gap-2 mb-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
              </svg>
            </div>
            <div className="py-2 px-3 rounded-lg bg-gray-200 flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
            </div>
          </div>
        )}
        
        {/* Incident Report Form - Now Scrollable */}
        {showIncidentForm && (
          <div className="border border-indigo-200 rounded-lg mb-4 bg-indigo-50 max-h-[500px] flex flex-col">
            {/* Form Header - Fixed */}
            <div className="p-4 border-b border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-2">Report an Incident</h3>
              <p className="text-sm text-gray-600">Please describe the incident in detail. Include what happened, when and where it occurred, and any details about the people involved.</p>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="p-4 overflow-y-auto custom-thin-scrollbar">
              <textarea
                ref={incidentInputRef}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                placeholder="Please describe the incident in detail, including what happened, when and where it occurred..."
                rows="5"
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                disabled={isAnalyzing || pdfReady}
              ></textarea>
              
              {/* New fields for duration and injuries */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration of Violence/Abuse:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Please specify how long the violence/abuse has been happening (e.g., one-time incident, 2 years, etc.)"
                  value={incidentDuration}
                  onChange={(e) => setIncidentDuration(e.target.value)}
                  disabled={isAnalyzing || pdfReady}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Injuries/Harm:</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Please describe any physical injuries, emotional trauma, or other harm you have experienced"
                  rows="3"
                  value={incidentInjuries}
                  onChange={(e) => setIncidentInjuries(e.target.value)}
                  disabled={isAnalyzing || pdfReady}
                ></textarea>
              </div>
              
              {/* Analysis in progress indicator */}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="mt-2 text-indigo-600 font-medium">Analyzing your incident...</p>
                </div>
              )}
              
              {/* PDF Ready - Download Section */}
              {pdfReady && incidentAnalysis && (
                <div className="border border-indigo-300 rounded-lg p-4 bg-indigo-100 mb-3">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-700 mr-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h4 className="font-medium text-indigo-800">Analysis Complete</h4>
                  </div>
                  
                  <p className="text-sm text-indigo-700 mb-4">Your incident has been analyzed. You can now download the FIR report.</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <RenderPDFDownload />
                    
                    <button
                      onClick={submitAnotherReport}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                        <path d="M3 22v-6h6"></path>
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                      </svg>
                      Report Another Incident
                    </button>
                    
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Form Buttons - Fixed at bottom */}
            {!isAnalyzing && !pdfReady && (
              <div className="p-3 border-t border-indigo-200 bg-indigo-50 flex justify-end gap-2">
                <button
                  onClick={() => setShowIncidentForm(false)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIncidentSubmit}
                  disabled={incidentText.trim() === ''}
                  className={`px-3 py-1 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 ${
                    incidentText.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom section that should not scroll */}
      <div className="flex-shrink-0"> {/* This ensures the bottom section doesn't scroll */}
        {/* Law Bot Prompt Suggestions */}
        {lawBotMessages.length === 0 && (
          <div className="px-4 py-2 bg-gray-100 flex flex-wrap gap-2">
            {promptSuggestions.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  if (lawBotInput.current) {
                    lawBotInput.current.value = prompt.text;
                    sendLawBotMessage();
                  }
                }}
                className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 text-xs hover:bg-gray-200 transition-all duration-200"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
            <button
              onClick={() => setShowIncidentForm(true)}
              className="flex items-center gap-1 border border-indigo-300 bg-indigo-100 rounded-full px-3 py-1 text-xs hover:bg-indigo-200 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>Report an incident</span>
            </button>
          </div>
        )}

        {/* Law Bot Input Area */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          <input
            ref={lawBotInput}
            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask about laws or describe an incident..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLawBotThinking && !isAnalyzing) {
                sendLawBotMessage();
              }
            }}
          />
          <button
            onClick={sendLawBotMessage}
            disabled={isLawBotThinking || isAnalyzing}
            className={`h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-all ${
              (isLawBotThinking || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLawBotThinking || isAnalyzing ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13"></path>
                <path d="m22 2-7 20-4-9-9-4 20-7z"></path>
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowIncidentForm(true)}
            className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-all"
            title="Report an incident"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}