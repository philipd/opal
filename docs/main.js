(function (storyContent) {

    var story = new inkjs.Story(storyContent);

    const wpm = 200;
    const wpms = wpm / 60 / 1000;

    var storyContainer = document.querySelectorAll('#story')[0];

    function isAnimationEnabled() {
        return window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    }

    function showAfter(delay, el) {
        setTimeout(function () { el.classList.add("show") }, isAnimationEnabled() ? delay : 0);
    }

    function computeWordCount(string) {
        const words = string.trim().split(/\s+/);
        return words.length;
    }

    function continueStory() {

        var paragraphIndex = 0;
        var delay = 0.0;

        // Generate story text - loop through available content
        while (story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();

            // Create paragraph element
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);

            wc = computeWordCount(paragraphElement.innerText);

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);

            delay += wc / wpms;
            console.log(wc, wpms, wc / wpms, delay);
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function (choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            wc = computeWordCount(choiceParagraphElement.innerText);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += wc / wpms;
            console.log(wc, wpms, delay);

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function (event) {

                // Don't follow <a> link
                event.preventDefault();

                // Remove all existing output
                var existingContent = storyContainer.querySelectorAll('p.show');
                for (var i = 0; i < existingContent.length; i++) {
                    var c = existingContent[i];
                    c.parentNode.removeChild(c);
                }

                // Tell the story where to go next
                story.ChooseChoiceIndex(choice.index);

                // Aaand loop
                continueStory();
            });
        });
    }

    continueStory();

})(storyContent);