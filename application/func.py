def minutes_to_formatted(total_minutes):
    if total_minutes <= 0:
        return None    
    hours = total_minutes // 60
    minutes = total_minutes % 60 
    if hours == 0:
        return f"{minutes}m"
    if minutes == 0:
        return f"{hours}h"   
    return f"{hours}h {minutes}m"

def minutes_to_hhmm(total_minutes):
    if total_minutes <= 0:
        return None    
    hours = total_minutes // 60
    minutes = total_minutes % 60 
    return f"{hours:02}:{minutes:02}"

def hhmm_to_minutes(time_str):
    parts = time_str.split(":")    
    if len(parts) != 2:
        return -1  # Invalid format    
    try:
        hours, minutes = int(parts[0]), int(parts[1])
    except ValueError:
        return -1  # Non-numeric values    
    if hours < 0 or minutes < 0 or minutes >= 60:
        return -1  # Invalid time values    
    return hours * 60 + minutes

def datetime_to_string(dt):
    return dt.strftime("%d/%m/%Y %I:%M %p") if dt else None


