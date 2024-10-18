Makes it easy to get the transcript from Grain videos.

Copies the transcript to clipboard.

Use the code below with one of the many "Create Bookmarklet" websites, then drag the result to your bookmarks bar for a button that will copy the transcript to your clipboard.

Click the bookmarklet when viewing the Grain video page to get the transcript.

Full code:
```js
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

    // 8. Construct the full transcript with speaker names as Markdown h5 headings
    let fullTranscript = "";
    speakerRanges.forEach(range => {
        const speakerName = getSpeakerName(range.speakerId);
        const words = transcriptEntries.slice(range.startIndex, range.endIndex + 1).map(entry => entry[1]).join(' ');
        fullTranscript += `##### ${speakerName}\n${words}\n\n`;
    });

    // 9. Create a temporary textarea to hold the transcript
    const textarea = document.createElement('textarea');
    textarea.value = fullTranscript;
    document.body.appendChild(textarea);

    // 10. Select the textarea content
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    // 11. Attempt to copy the transcript to the clipboard using execCommand
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Transcript successfully copied to clipboard.');
            alert('Transcript has been copied to your clipboard!');
        } else {
            console.error('Failed to copy transcript to clipboard.');
            alert('Failed to copy transcript. Please try again.');
        }
    } catch (err) {
        console.error('Error copying transcript:', err);
        alert('Failed to copy transcript. Please try again.');
    }

    // 12. Remove the temporary textarea from the DOM
    document.body.removeChild(textarea);
})();

```