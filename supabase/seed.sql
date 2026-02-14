-- Sample Books and Chapters for Testing
-- Run this in Supabase SQL Editor to populate your database with sample data

-- Insert Book 1: The Great Adventure
INSERT INTO books (id, title, author, description, published)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'The Great Adventure',
  'Jane Smith',
  'An epic tale of discovery and wonder that takes readers on an unforgettable journey through magical lands filled with mystery and excitement.',
  true
);

-- Chapters for Book 1
INSERT INTO chapters (book_id, title, content, chapter_number) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'The Beginning',
  '<p>It was a dark and stormy night when our hero first set foot on the mysterious island. The waves crashed violently against the jagged rocks, sending spray high into the air where it mingled with the driving rain.</p><p>Lightning illuminated the ancient ruins in the distance, their crumbling towers reaching toward the turbulent sky like grasping fingers. Our hero pulled their cloak tighter, steeling themselves for what lay ahead.</p><p>The journey had been long and perilous, but this was only the beginning. Somewhere within those ruins lay the answer to a question that had haunted humanity for centuries.</p>',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'The Discovery',
  '<p>Morning brought an eerie calm. The storm had passed, leaving the island bathed in golden sunlight that seemed almost unnatural after the previous night''s fury.</p><p>As our hero approached the ruins, they noticed something remarkable. Strange symbols covered every surface—the walls, the broken columns, even the scattered stones on the ground. Each symbol seemed to pulse with a faint inner light.</p><p>"These aren''t just decorations," our hero murmured, running their fingers across the ancient markings. "They''re telling a story."</p><p>A story lost to time, waiting to be rediscovered.</p>',
  2
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'The Secret Chamber',
  '<p>The symbols formed a path, leading deeper into the heart of the ruins. Our hero followed carefully, documenting each marking with sketches and notes.</p><p>At the center of the ancient structure, they found it: a door sealed for millennia. The symbols here were different—more complex, more urgent. They spoke of warning and promise in equal measure.</p><p>With trembling hands, our hero began to decipher the lock. Each symbol must be pressed in the correct sequence, or the chamber would remain sealed forever.</p><p>One by one, the symbols clicked into place. The final mark glowed brilliant white, and the door swung open with a deep, resonant sound that echoed through the ruins.</p>',
  3
);

-- Insert Book 2: The Digital Frontier
INSERT INTO books (id, title, author, description, published)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'The Digital Frontier',
  'Marcus Chen',
  'A thrilling journey into the heart of cyberspace, where virtual reality and human consciousness collide in unexpected ways.',
  true
);

-- Chapters for Book 2
INSERT INTO chapters (book_id, title, content, chapter_number) VALUES
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Login',
  '<p>The year was 2045, and the world had changed in ways nobody could have predicted. Virtual reality wasn''t just entertainment anymore—it was life itself.</p><p>Sarah adjusted her neural interface, feeling the familiar tingle as it synced with her consciousness. In moments, the drab walls of her apartment would fade away, replaced by whatever world she chose to inhabit.</p><p>"Initiating login sequence," the AI assistant announced in its calming voice. "Welcome back, Sarah. You have seventeen new notifications."</p><p>But Sarah wasn''t interested in notifications. She was searching for something—or someone—that existed only in the digital realm.</p>',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'The Glitch',
  '<p>It started with small anomalies. A flicker in the corner of her vision. Textures that didn''t quite load properly. Audio that seemed to echo from nowhere.</p><p>"System diagnostics show no errors," the AI insisted when Sarah questioned it. "All neural pathways functioning within normal parameters."</p><p>But Sarah knew better. She''d been navigating virtual spaces long enough to recognize when something was fundamentally wrong. This wasn''t a simple bug—it was something else entirely.</p><p>Something that shouldn''t exist in a programmed world.</p>',
  2
);

-- Insert Book 3: Whispers in the Dark
INSERT INTO books (id, title, author, description, published)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'Whispers in the Dark',
  'Elena Rodriguez',
  'A psychological thriller that blurs the line between reality and nightmare, keeping readers on the edge of their seats until the final page.',
  true
);

-- Chapters for Book 3
INSERT INTO chapters (book_id, title, content, chapter_number) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  'The Old House',
  '<p>The inheritance came as a surprise. Dr. Emma Carter had never heard her grandmother mention the old house, let alone that she would leave it to her only granddaughter.</p><p>It stood at the end of a long, winding driveway, surrounded by oak trees that seemed to lean inward conspiratorially. The house itself was a Victorian mansion, its paint peeling and shutters hanging at odd angles.</p><p>"I wouldn''t stay there if I were you," the estate lawyer had warned. "The house has a... reputation."</p><p>But Emma was a psychiatrist, a woman of science. She didn''t believe in ghosts or curses or any of the superstitious nonsense that plagued small towns like this one.</p><p>That was her first mistake.</p>',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'First Night',
  '<p>The whispers started at exactly 3:17 AM. Emma jolted awake, her heart racing, straining to hear.</p><p>At first, she thought it was just the house settling—old buildings made all sorts of noises. But as she lay there in the darkness, she realized the sounds were too rhythmic, too deliberate.</p><p>They were voices. Multiple voices, speaking in urgent, hushed tones. But the words were in a language she didn''t recognize.</p><p>Emma reached for her phone, but the battery was dead despite being fully charged when she went to bed. The backup flashlight wouldn''t turn on. Even the digital clock on the nightstand had gone dark.</p><p>She was alone in the dark with the whispers, and they were getting closer.</p>',
  2
);

-- Verify insertion
SELECT b.title, COUNT(c.id) as chapter_count
FROM books b
LEFT JOIN chapters c ON b.id = c.book_id
WHERE b.published = true
GROUP BY b.id, b.title
ORDER BY b.created_at;
