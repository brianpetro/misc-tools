(function() {
  // 1. Function to decode HTML entities
  function decodeHTMLEntities(text) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
  }

  // 2. Select the meta tag containing the JSON
  const metaTag = document.querySelector('meta[name="grain:recording:json"]');
  if (!metaTag) {
      console.error('Meta tag with name "grain:recording:json" not found.');
      alert('Transcript meta tag not found.');
      return;
  }

  // 3. Get the content attribute value
  const encodedJson = metaTag.getAttribute('content');
  if (!encodedJson) {
      console.error('Meta tag "grain:recording:json" does not contain content.');
      alert('Transcript meta tag is empty.');
      return;
  }

  // 4. Decode HTML entities to get the JSON string
  const jsonString = decodeHTMLEntities(encodedJson);

  // 5. Parse the JSON string into a JavaScript object
  let recordingData;
  try {
      recordingData = JSON.parse(jsonString);
  } catch (error) {
      console.error('Failed to parse JSON:', error);
      alert('Failed to parse transcript data.');
      return;
  }

  // 6. Extract transcript entries, speakers, and speaker ranges
  const transcriptEntries = recordingData.transcript.data.results;
  const speakers = recordingData.transcript.data.speakers;
  const speakerRanges = recordingData.transcript.data.speakerRanges;

  // 7. Function to get speaker name by ID
  const getSpeakerName = (speakerId) => {
      const speaker = speakers.find(s => s.id === speakerId);
      return speaker ? speaker.name : "Unknown Speaker";
  };

  // 8. Function to format milliseconds to SRT time format (hh:mm:ss,ms)
  const formatTime = (milliseconds) => {
      const date = new Date(milliseconds);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const millisecondsStr = String(date.getUTCMilliseconds()).padStart(3, '0');
      return `${hours}:${minutes}:${seconds},${millisecondsStr}`;
  };

  // 9. Construct the full transcript in SRT format
  let srtContent = "";
  let index = 1;

  speakerRanges.forEach(range => {
      const speakerName = getSpeakerName(range.speakerId);
      const entries = transcriptEntries.slice(range.startIndex, range.endIndex + 1);
      
      // Start and end timestamps in milliseconds
      const startTime = entries[0][0];
      const endTime = entries[entries.length - 1][0];

      // Speaker label and text
      const words = entries.map(entry => entry[1]).join(' ');
      
      srtContent += `${index}\n`;
      srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      srtContent += `${speakerName}: ${words}\n\n`;
      index++;
  });

  // 10. Create a temporary textarea to hold the SRT content
  const textarea = document.createElement('textarea');
  textarea.value = srtContent;
  document.body.appendChild(textarea);

  // 11. Select the textarea content
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  // 12. Attempt to copy the SRT content to the clipboard using execCommand
  try {
      const successful = document.execCommand('copy');
      if (successful) {
          console.log('Transcript successfully copied to clipboard as SRT.');
          alert('Transcript has been copied to your clipboard in SRT format!');
      } else {
          console.error('Failed to copy transcript to clipboard.');
          alert('Failed to copy transcript. Please try again.');
      }
  } catch (err) {
      console.error('Error copying transcript:', err);
      alert('Failed to copy transcript. Please try again.');
  }

  // 13. Remove the temporary textarea from the DOM
  document.body.removeChild(textarea);
})();
