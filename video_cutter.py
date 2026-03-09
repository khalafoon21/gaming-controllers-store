#!/usr/bin/env python3
"""
سكريبت لتقطيع الفيديو بالثواني المحددة
مع خيار التحويل بين الوضع الرأسي والعامودي
وتخطي حقوق الطبع والنشر
"""

import os
import sys
from moviepy.editor import VideoFileClip, CompositeVideoClip, TextClip
from moviepy.video.fx import resize, crop
import argparse


def remove_watermark(clip, method='crop'):
    """
    إزالة أو تخطي حقوق الطبع والنشر من الفيديو
    
    Args:
        clip: مقطع الفيديو
        method: طريقة الإزالة ('crop', 'blur', 'none')
    
    Returns:
        مقطع الفيديو بعد المعالجة
    """
    if method == 'crop':
        # قص الفيديو لإزالة العلامة المائية (عادة في الأسفل أو الأعلى)
        w, h = clip.size
        # قص 10% من الأسفل و 5% من الأعلى
        cropped = crop(clip, y1=int(h * 0.05), y2=int(h * 0.90))
        return cropped
    elif method == 'blur':
        # يمكن إضافة تمويه على مناطق معينة
        return clip
    else:
        return clip


def convert_orientation(clip, orientation='vertical'):
    """
    تحويل الفيديو بين الوضع الرأسي والعامودي
    
    Args:
        clip: مقطع الفيديو
        orientation: 'vertical' للعامودي أو 'horizontal' للرأسي
    
    Returns:
        مقطع الفيديو بعد التحويل
    """
    w, h = clip.size
    
    if orientation == 'vertical':
        # تحويل إلى عامودي (9:16)
        target_ratio = 9 / 16
        current_ratio = w / h
        
        if current_ratio > target_ratio:
            # الفيديو عريض، نحتاج لقصه
            new_width = int(h * target_ratio)
            x_center = w / 2
            x1 = int(x_center - new_width / 2)
            x2 = int(x_center + new_width / 2)
            return crop(clip, x1=x1, x2=x2)
        else:
            # الفيديو طويل، نحتاج لتكبيره
            new_height = int(w / target_ratio)
            return resize(clip, height=new_height)
    
    elif orientation == 'horizontal':
        # تحويل إلى رأسي (16:9)
        target_ratio = 16 / 9
        current_ratio = w / h
        
        if current_ratio < target_ratio:
            # الفيديو طويل، نحتاج لقصه
            new_height = int(w / target_ratio)
            y_center = h / 2
            y1 = int(y_center - new_height / 2)
            y2 = int(y_center + new_height / 2)
            return crop(clip, y1=y1, y2=y2)
        else:
            # الفيديو عريض، نحتاج لتكبيره
            new_width = int(h * target_ratio)
            return resize(clip, width=new_width)
    
    return clip


def cut_video(input_file, start_time, end_time, output_file, orientation='none', remove_copyright=False):
    """
    قص الفيديو من وقت البداية إلى وقت النهاية
    
    Args:
        input_file: ملف الفيديو المدخل
        start_time: وقت البداية بالثواني
        end_time: وقت النهاية بالثواني
        output_file: ملف الفيديو الناتج
        orientation: 'vertical', 'horizontal', أو 'none'
        remove_copyright: إزالة حقوق الطبع والنشر
    """
    print(f"📹 جاري تحميل الفيديو: {input_file}")
    
    # تحميل الفيديو
    video = VideoFileClip(input_file)
    
    print(f"⏱️  مدة الفيديو الأصلي: {video.duration:.2f} ثانية")
    print(f"✂️  القص من {start_time} إلى {end_time} ثانية")
    
    # قص الفيديو
    cut_clip = video.subclip(start_time, end_time)
    
    # إزالة حقوق الطبع والنشر
    if remove_copyright:
        print("🚫 جاري إزالة حقوق الطبع والنشر...")
        cut_clip = remove_watermark(cut_clip, method='crop')
    
    # تحويل الاتجاه
    if orientation != 'none':
        print(f"🔄 جاري التحويل إلى الوضع {'العامودي' if orientation == 'vertical' else 'الرأسي'}...")
        cut_clip = convert_orientation(cut_clip, orientation)
    
    # حفظ الفيديو
    print(f"💾 جاري حفظ الفيديو: {output_file}")
    cut_clip.write_videofile(
        output_file,
        codec='libx264',
        audio_codec='aac',
        temp_audiofile='temp-audio.m4a',
        remove_temp=True,
        fps=video.fps
    )
    
    # إغلاق الملفات
    video.close()
    cut_clip.close()
    
    print(f"✅ تم! الفيديو محفوظ في: {output_file}")


def interactive_mode():
    """
    الوضع التفاعلي للسكريبت
    """
    print("=" * 50)
    print("🎬 سكريبت تقطيع الفيديو")
    print("=" * 50)
    
    # إدخال ملف الفيديو
    input_file = input("\n📁 أدخل مسار ملف الفيديو: ").strip()
    
    if not os.path.exists(input_file):
        print(f"❌ خطأ: الملف {input_file} غير موجود!")
        return
    
    # عرض معلومات الفيديو
    video = VideoFileClip(input_file)
    print(f"\n📊 معلومات الفيديو:")
    print(f"   - المدة: {video.duration:.2f} ثانية")
    print(f"   - الأبعاد: {video.w}x{video.h}")
    print(f"   - FPS: {video.fps}")
    video.close()
    
    # إدخال أوقات القص
    print("\n⏱️  أدخل أوقات القص بالثواني:")
    start_time = float(input("   - وقت البداية: "))
    end_time = float(input("   - وقت النهاية: "))
    
    # اختيار الاتجاه
    print("\n🔄 اختر اتجاه الفيديو:")
    print("   1. رأسي (أفقي - 16:9)")
    print("   2. عامودي (رأسي - 9:16)")
    print("   3. بدون تغيير")
    
    orientation_choice = input("   اختيارك (1/2/3): ").strip()
    
    orientation_map = {
        '1': 'horizontal',
        '2': 'vertical',
        '3': 'none'
    }
    orientation = orientation_map.get(orientation_choice, 'none')
    
    # إزالة حقوق الطبع والنشر
    remove_copyright = input("\n🚫 هل تريد تخطي حقوق الطبع والنشر؟ (y/n): ").strip().lower() == 'y'
    
    # اسم الملف الناتج
    base_name = os.path.splitext(input_file)[0]
    output_file = input(f"\n💾 أدخل اسم الملف الناتج (اضغط Enter للافتراضي: {base_name}_cut.mp4): ").strip()
    
    if not output_file:
        output_file = f"{base_name}_cut.mp4"
    
    # تنفيذ القص
    print("\n" + "=" * 50)
    cut_video(input_file, start_time, end_time, output_file, orientation, remove_copyright)
    print("=" * 50)


def main():
    """
    الدالة الرئيسية
    """
    parser = argparse.ArgumentParser(
        description='سكريبت لتقطيع الفيديو بالثواني المحددة',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
أمثلة الاستخدام:
  # الوضع التفاعلي
  python video_cutter.py
  
  # قص فيديو من 10 إلى 30 ثانية
  python video_cutter.py -i video.mp4 -s 10 -e 30 -o output.mp4
  
  # قص وتحويل إلى عامودي مع إزالة حقوق الطبع
  python video_cutter.py -i video.mp4 -s 5 -e 25 -o output.mp4 --vertical --remove-copyright
        """
    )
    
    parser.add_argument('-i', '--input', help='ملف الفيديو المدخل')
    parser.add_argument('-s', '--start', type=float, help='وقت البداية بالثواني')
    parser.add_argument('-e', '--end', type=float, help='وقت النهاية بالثواني')
    parser.add_argument('-o', '--output', help='ملف الفيديو الناتج')
    parser.add_argument('--vertical', action='store_true', help='تحويل إلى عامودي (9:16)')
    parser.add_argument('--horizontal', action='store_true', help='تحويل إلى رأسي (16:9)')
    parser.add_argument('--remove-copyright', action='store_true', help='تخطي حقوق الطبع والنشر')
    
    args = parser.parse_args()
    
    # إذا لم يتم تمرير معاملات، استخدم الوضع التفاعلي
    if not args.input:
        interactive_mode()
    else:
        # التحقق من المعاملات المطلوبة
        if not all([args.input, args.start is not None, args.end is not None, args.output]):
            parser.error("يجب تحديد جميع المعاملات: -i, -s, -e, -o")
        
        # تحديد الاتجاه
        orientation = 'none'
        if args.vertical:
            orientation = 'vertical'
        elif args.horizontal:
            orientation = 'horizontal'
        
        # تنفيذ القص
        cut_video(
            args.input,
            args.start,
            args.end,
            args.output,
            orientation,
            args.remove_copyright
        )


if __name__ == "__main__":
    main()
