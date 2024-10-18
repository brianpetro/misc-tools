Makes it easy to get the transcript from Grain videos.

Copies the transcript to clipboard.

Drag this to your bookmarks bar:
<a id="bookmarklet-a" class="bookmarklet" href="javascript:(function()%7B(function()%20%7B%0A%20%20%20%20%2F%2F%201.%20Function%20to%20decode%20HTML%20entities%0A%20%20%20%20function%20decodeHTMLEntities(text)%20%7B%0A%20%20%20%20%20%20%20%20const%20textarea%20%3D%20document.createElement('textarea')%3B%0A%20%20%20%20%20%20%20%20textarea.innerHTML%20%3D%20text%3B%0A%20%20%20%20%20%20%20%20return%20textarea.value%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%202.%20Select%20the%20meta%20tag%20containing%20the%20JSON%0A%20%20%20%20const%20metaTag%20%3D%20document.querySelector('meta%5Bname%3D%22grain%3Arecording%3Ajson%22%5D')%3B%0A%20%20%20%20if%20(!metaTag)%20%7B%0A%20%20%20%20%20%20%20%20console.error('Meta%20tag%20with%20name%20%22grain%3Arecording%3Ajson%22%20not%20found.')%3B%0A%20%20%20%20%20%20%20%20alert('Transcript%20meta%20tag%20not%20found.')%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%203.%20Get%20the%20content%20attribute%20value%0A%20%20%20%20const%20encodedJson%20%3D%20metaTag.getAttribute('content')%3B%0A%20%20%20%20if%20(!encodedJson)%20%7B%0A%20%20%20%20%20%20%20%20console.error('Meta%20tag%20%22grain%3Arecording%3Ajson%22%20does%20not%20contain%20content.')%3B%0A%20%20%20%20%20%20%20%20alert('Transcript%20meta%20tag%20is%20empty.')%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%204.%20Decode%20HTML%20entities%20to%20get%20the%20JSON%20string%0A%20%20%20%20const%20jsonString%20%3D%20decodeHTMLEntities(encodedJson)%3B%0A%0A%20%20%20%20%2F%2F%205.%20Parse%20the%20JSON%20string%20into%20a%20JavaScript%20object%0A%20%20%20%20let%20recordingData%3B%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20recordingData%20%3D%20JSON.parse(jsonString)%3B%0A%20%20%20%20%7D%20catch%20(error)%20%7B%0A%20%20%20%20%20%20%20%20console.error('Failed%20to%20parse%20JSON%3A'%2C%20error)%3B%0A%20%20%20%20%20%20%20%20alert('Failed%20to%20parse%20transcript%20data.')%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%206.%20Extract%20transcript%20entries%2C%20speakers%2C%20and%20speaker%20ranges%0A%20%20%20%20const%20transcriptEntries%20%3D%20recordingData.transcript.data.results%3B%0A%20%20%20%20const%20speakers%20%3D%20recordingData.transcript.data.speakers%3B%0A%20%20%20%20const%20speakerRanges%20%3D%20recordingData.transcript.data.speakerRanges%3B%0A%0A%20%20%20%20%2F%2F%207.%20Function%20to%20get%20speaker%20name%20by%20ID%0A%20%20%20%20const%20getSpeakerName%20%3D%20(speakerId)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20const%20speaker%20%3D%20speakers.find(s%20%3D%3E%20s.id%20%3D%3D%3D%20speakerId)%3B%0A%20%20%20%20%20%20%20%20return%20speaker%20%3F%20speaker.name%20%3A%20%22Unknown%20Speaker%22%3B%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20%2F%2F%208.%20Construct%20the%20full%20transcript%20with%20speaker%20names%20as%20Markdown%20h5%20headings%0A%20%20%20%20let%20fullTranscript%20%3D%20%22%22%3B%0A%20%20%20%20speakerRanges.forEach(range%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20const%20speakerName%20%3D%20getSpeakerName(range.speakerId)%3B%0A%20%20%20%20%20%20%20%20const%20words%20%3D%20transcriptEntries.slice(range.startIndex%2C%20range.endIndex%20%2B%201).map(entry%20%3D%3E%20entry%5B1%5D).join('%20')%3B%0A%20%20%20%20%20%20%20%20fullTranscript%20%2B%3D%20%60%23%23%23%23%23%20%24%7BspeakerName%7D%5Cn%24%7Bwords%7D%5Cn%5Cn%60%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20%2F%2F%209.%20Create%20a%20temporary%20textarea%20to%20hold%20the%20transcript%0A%20%20%20%20const%20textarea%20%3D%20document.createElement('textarea')%3B%0A%20%20%20%20textarea.value%20%3D%20fullTranscript%3B%0A%20%20%20%20document.body.appendChild(textarea)%3B%0A%0A%20%20%20%20%2F%2F%2010.%20Select%20the%20textarea%20content%0A%20%20%20%20textarea.select()%3B%0A%20%20%20%20textarea.setSelectionRange(0%2C%2099999)%3B%20%2F%2F%20For%20mobile%20devices%0A%0A%20%20%20%20%2F%2F%2011.%20Attempt%20to%20copy%20the%20transcript%20to%20the%20clipboard%20using%20execCommand%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20const%20successful%20%3D%20document.execCommand('copy')%3B%0A%20%20%20%20%20%20%20%20if%20(successful)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log('Transcript%20successfully%20copied%20to%20clipboard.')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20alert('Transcript%20has%20been%20copied%20to%20your%20clipboard!')%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.error('Failed%20to%20copy%20transcript%20to%20clipboard.')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20alert('Failed%20to%20copy%20transcript.%20Please%20try%20again.')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%20catch%20(err)%20%7B%0A%20%20%20%20%20%20%20%20console.error('Error%20copying%20transcript%3A'%2C%20err)%3B%0A%20%20%20%20%20%20%20%20alert('Failed%20to%20copy%20transcript.%20Please%20try%20again.')%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20%2F%2F%2012.%20Remove%20the%20temporary%20textarea%20from%20the%20DOM%0A%20%20%20%20document.body.removeChild(textarea)%3B%0A%7D)()%3B%7D)()%3B">Get Grain Transcript</a>

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