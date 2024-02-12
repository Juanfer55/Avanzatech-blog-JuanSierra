""" Creates a content excerpt from a given content. """

def create_content_excerpt(content):
    
    if len(content) > 200:
        return content[:197] + "..."
    else:
        return content
