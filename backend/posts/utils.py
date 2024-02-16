""" Creates a content excerpt from a given content. """

def create_content_excerpt(content):
    
    words = content.split()

    if len(words) >= 200:
        return ' '.join(words[:200]) + '...'
    else:
        return content
