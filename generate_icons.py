from PIL import Image, ImageDraw
import os

def create_icon(filename, icon_type, color, size=81):
    """Create a simple icon image"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    margin = size // 6
    inner_size = size - 2 * margin
    
    if icon_type == 'home':
        # Draw house icon
        if 'active' in filename:
            # Filled house
            points = [
                (size//2, margin),
                (size - margin, size//2),
                (size - margin, size - margin),
                (margin, size - margin),
                (margin, size//2)
            ]
            draw.polygon(points, fill=color)
            # Door
            door_width = inner_size // 3
            door_height = inner_size // 2
            door_x = (size - door_width) // 2
            door_y = size - margin - door_height
            draw.rectangle([door_x, door_y, door_x + door_width, door_y + door_height], fill=(255, 255, 255, 255))
        else:
            # Outline house
            points = [
                (size//2, margin),
                (size - margin, size//2),
                (size - margin, size - margin),
                (margin, size - margin),
                (margin, size//2)
            ]
            draw.polygon(points, outline=color, width=3)
            # Door outline
            door_width = inner_size // 3
            door_height = inner_size // 2
            door_x = (size - door_width) // 2
            door_y = size - margin - door_height
            draw.rectangle([door_x, door_y, door_x + door_width, door_y + door_height], outline=color, width=2)
    
    elif icon_type == 'study':
        # Draw book icon
        book_margin = margin + 5
        if 'active' in filename:
            # Filled book
            draw.rectangle([book_margin, book_margin, size - book_margin, size - book_margin], fill=color, outline=color)
            # Book spine line
            draw.line([(size//2, book_margin), (size//2, size - book_margin)], fill=(255, 255, 255, 255), width=2)
            # Pages lines
            for i in range(3):
                y = book_margin + 15 + i * 12
                draw.line([(book_margin + 8, y), (size//2 - 5, y)], fill=(255, 255, 255, 255), width=1)
                draw.line([(size//2 + 5, y), (size - book_margin - 8, y)], fill=(255, 255, 255, 255), width=1)
        else:
            # Outline book
            draw.rectangle([book_margin, book_margin, size - book_margin, size - book_margin], outline=color, width=3)
            draw.line([(size//2, book_margin), (size//2, size - book_margin)], fill=color, width=2)
    
    elif icon_type == 'practice':
        # Draw checkmark in circle
        center = size // 2
        radius = inner_size // 2
        if 'active' in filename:
            # Filled circle with checkmark
            draw.ellipse([center - radius, center - radius, center + radius, center + radius], fill=color)
            # White checkmark
            check_points = [
                (center - radius//3, center),
                (center - radius//6, center + radius//3),
                (center + radius//2, center - radius//3)
            ]
            draw.line(check_points, fill=(255, 255, 255, 255), width=4)
        else:
            # Outline circle with checkmark
            draw.ellipse([center - radius, center - radius, center + radius, center + radius], outline=color, width=3)
            check_points = [
                (center - radius//3, center),
                (center - radius//6, center + radius//3),
                (center + radius//2, center - radius//3)
            ]
            draw.line(check_points, fill=color, width=3)
    
    elif icon_type == 'exam':
        # Draw exam/test icon - document with pencil
        center = size // 2
        if 'active' in filename:
            # Filled document
            doc_margin = margin + 3
            draw.rectangle([doc_margin, doc_margin, size - doc_margin, size - doc_margin], fill=color, outline=color)
            # White lines representing text
            line_y_start = doc_margin + 12
            for i in range(3):
                y = line_y_start + i * 14
                draw.line([(doc_margin + 10, y), (size - doc_margin - 10, y)], fill=(255, 255, 255, 255), width=2)
            # Checkmark at bottom
            check_y = line_y_start + 3 * 14 + 5
            draw.line([(center - 8, check_y), (center - 2, check_y + 6)], fill=(255, 255, 255, 255), width=2)
            draw.line([(center - 2, check_y + 6), (center + 8, check_y - 4)], fill=(255, 255, 255, 255), width=2)
        else:
            # Outline document
            doc_margin = margin + 3
            draw.rectangle([doc_margin, doc_margin, size - doc_margin, size - doc_margin], outline=color, width=3)
            # Lines
            line_y_start = doc_margin + 12
            for i in range(3):
                y = line_y_start + i * 14
                draw.line([(doc_margin + 10, y), (size - doc_margin - 10, y)], fill=color, width=2)
            # Checkmark
            check_y = line_y_start + 3 * 14 + 5
            draw.line([(center - 8, check_y), (center - 2, check_y + 6)], fill=color, width=2)
            draw.line([(center - 2, check_y + 6), (center + 8, check_y - 4)], fill=color, width=2)
    
    elif icon_type == 'profile':
        # Draw user icon
        center = size // 2
        if 'active' in filename:
            # Filled user
            # Head
            head_radius = inner_size // 4
            draw.ellipse([center - head_radius, margin + 5, center + head_radius, margin + 5 + 2*head_radius], fill=color)
            # Body
            body_top = margin + 5 + 2*head_radius + 3
            body_points = [
                (center, body_top),
                (center - inner_size//2, size - margin),
                (center + inner_size//2, size - margin)
            ]
            draw.polygon(body_points, fill=color)
        else:
            # Outline user
            head_radius = inner_size // 4
            draw.ellipse([center - head_radius, margin + 5, center + head_radius, margin + 5 + 2*head_radius], outline=color, width=3)
            body_top = margin + 5 + 2*head_radius + 3
            draw.arc([center - inner_size//2, body_top - inner_size//3, center + inner_size//2, size - margin + inner_size//3], 0, 180, fill=color, width=3)
    
    return img

def main():
    images_dir = r'e:\办公小程序\外贸英文学习\images'
    os.makedirs(images_dir, exist_ok=True)
    
    # Color definitions
    gray = (153, 153, 153, 255)  # #999999
    blue = (30, 95, 142, 255)    # #1E5F8E
    
    icons = [
        ('home.png', 'home', gray),
        ('home-active.png', 'home', blue),
        ('study.png', 'study', gray),
        ('study-active.png', 'study', blue),
        ('practice.png', 'practice', gray),
        ('practice-active.png', 'practice', blue),
        ('exam.png', 'exam', gray),
        ('exam-active.png', 'exam', blue),
        ('profile.png', 'profile', gray),
        ('profile-active.png', 'profile', blue),
    ]
    
    created_files = []
    for filename, icon_type, color in icons:
        filepath = os.path.join(images_dir, filename)
        img = create_icon(filename, icon_type, color)
        img.save(filepath, 'PNG')
        created_files.append(filepath)
        print(f'Created: {filepath}')
    
    print(f'\nTotal {len(created_files)} icons created successfully!')
    return created_files

if __name__ == '__main__':
    main()
