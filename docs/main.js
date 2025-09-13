(function (storyContent) {

    var story = new inkjs.Story(storyContent);

    var storyContainer = document.querySelectorAll('#story')[0];

    function isAnimationEnabled() {
        return window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    }

    function showAfter(delay, el) {
        setTimeout(function () { el.classList.add("show") }, isAnimationEnabled() ? delay : 0);
    }

    function scrollToBottom() {
        // Respect reduced-motion or your own toggle.
        if (!isAnimationEnabled || !isAnimationEnabled()) {
            // Still jump to bottom if animations are off.
            const root = document.scrollingElement || document.documentElement;
            const viewportH = window.innerHeight;
            const target = Math.max(0, (root.scrollHeight || 0) - viewportH);
            window.scrollTo(0, target);
            return;
        }

        const root = document.scrollingElement || document.documentElement;

        // Lock values that can change mid-scroll on mobile (address bar hide/show).
        const startY = root.scrollTop || window.pageYOffset || 0;
        const viewportH = window.innerHeight;
        const totalH = Math.max(root.scrollHeight, document.body ? document.body.scrollHeight : 0);
        const targetY = Math.max(0, totalH - viewportH);

        const dist = targetY - startY;
        if (dist <= 0) return;

        // If native smooth scroll is supported, use it.
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
            return;
        }

        // Fallback: rAF tween with a clamp.
        const min = 250, max = 900;
        const pxPerMs = 1.2; // tune as you like
        const duration = Math.max(min, Math.min(max, Math.abs(dist) / pxPerMs));

        let startTime = null;
        function step(now) {
            if (startTime === null) startTime = now;
            let t = (now - startTime) / duration;
            if (t > 1) t = 1;

            // Smoothstep (cubic) easing: 3t^2 - 2t^3
            const ease = 3 * t * t - 2 * t * t * t;

            // Recompute from the original start to avoid compounding error.
            window.scrollTo(0, startY + ease * dist);

            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
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

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);

            delay += 200.0;
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function (choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += 200.0;

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

        scrollToBottom();
    }

    continueStory();

})(storyContent);