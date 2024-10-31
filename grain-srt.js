(function() {
  // 1. Function to decode HTML entities
  function decodeHTMLEntities(text) {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
  }

  // 2. Function to format milliseconds to SRT timestamp
  function formatTimestamp(ms) {
      const date = new Date(ms);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
      return `${hours}:${minutes}:${seconds},${milliseconds}`;
  }

  // 3. Select the meta tag containing the JSON
  const metaTag = document.querySelector('meta[name="grain:recording:json"]');
  if (!metaTag) {
      console.error('Meta tag with name "grain:recording:json" not found.');
      alert('Transcript meta tag not found.');
      return;
  }

  // 4. Get the content attribute value
  const encodedJson = metaTag.getAttribute('content');
  if (!encodedJson) {
      console.error('Meta tag "grain:recording:json" does not contain content.');
      alert('Transcript meta tag is empty.');
      return;
  }

  // 5. Decode HTML entities to get the JSON string
  const jsonString = decodeHTMLEntities(encodedJson);

  // 6. Parse the JSON string into a JavaScript object
  let recordingData;
  try {
      recordingData = JSON.parse(jsonString);
  } catch (error) {
      console.error('Failed to parse JSON:', error);
      alert('Failed to parse transcript data.');
      return;
  }

  // 7. Extract transcript entries, speakers, and speaker ranges
  const transcriptEntries = recordingData.transcript.data.results;
  const speakers = recordingData.transcript.data.speakers;
  const speakerRanges = recordingData.transcript.data.speakerRanges;

  // 8. Function to get speaker name by ID
  const getSpeakerName = (speakerId) => {
      const speaker = speakers.find(s => s.id === speakerId);
      return speaker ? speaker.name : "Unknown Speaker";
  };

  // 9. Group words into subtitle blocks
  // For simplicity, we'll create a new subtitle every 5 seconds or every 10 words
  const SUBTITLE_DURATION_MS = 5000; // 5 seconds
  const MAX_WORDS_PER_SUBTITLE = 10;

  let subtitles = [];
  let currentSubtitle = {
      startTime: null,
      endTime: null,
      text: ''
  };
  let wordCount = 0;

  transcriptEntries.forEach(entry => {
      const [startMs, word, endMs] = entry;
      
      if (!currentSubtitle.startTime) {
          currentSubtitle.startTime = startMs;
      }
      currentSubtitle.endTime = endMs;
      currentSubtitle.text += word + ' ';
      wordCount++;

      // Check if we need to create a new subtitle block
      if ((currentSubtitle.endTime - currentSubtitle.startTime) >= SUBTITLE_DURATION_MS || wordCount >= MAX_WORDS_PER_SUBTITLE) {
          subtitles.push({ ...currentSubtitle });
          // Reset for the next subtitle
          currentSubtitle = {
              startTime: null,
              endTime: null,
              text: ''
          };
          wordCount = 0;
      }
  });

  // Push the last subtitle if it has any text
  if (currentSubtitle.text.trim().length > 0) {
      subtitles.push({ ...currentSubtitle });
  }

  // 10. Construct the SRT content
  let srtContent = '';
  subtitles.forEach((subtitle, index) => {
      const startTimestamp = formatTimestamp(subtitle.startTime);
      const endTimestamp = formatTimestamp(subtitle.endTime);
      const text = subtitle.text.trim();

      srtContent += `${index + 1}\n${startTimestamp} --> ${endTimestamp}\n${text}\n\n`;
  });

  // 11. Create a Blob from the SRT content
  const blob = new Blob([srtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // 12. Create a temporary link to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${recordingData.title}.srt`;
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // 13. Clean up by removing the temporary link and revoking the object URL
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  alert('SRT file has been generated and downloaded!');
})();
