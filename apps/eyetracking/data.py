from heatmap import Heatmapper
from PIL import Image
from PIL import ImageDraw
import matplotlib.pyplot as plt
example_imt_path = 'image/ex1.png'
example_img = Image.open(example_imt_path)
cnt = 0
example_points= [[514, 692], [539, 733], [540, 734], [518, 715], [514, 717], [495, 680], [484, 629], [456, 575], [394, 539], [344, 481], [340, 447], [343, 429], [335, 423], [318, 412], [323, 392], [316, 367], [340, 322], [375, 354], [403, 293], [401, 260], [405, 278], [409, 257], [434, 232], [456, 209], [467, 217], [492, 229], [506, 259], [533, 246], [571, 232], [580, 228], [595, 249], [630, 339], [631, 354], [622, 355], [609, 420], [520, 428], [511, 425], [467, 389], [453, 413], [417, 454], [352, 333], [343, 350], [362, 397], [385, 431], [386, 422], [398, 413], [389, 412], [392, 377], [405, 339], [430, 479], [434, 521], [422, 481], [456, 463], [455, 428], [468, 434], [466, 431], [463, 420], [501, 474], [478, 433], [464, 420], [459, 441], [436, 457], [445, 459], [465, 461], [474, 447], [454, 452], [439, 443], [463, 471], [487, 522], [537, 566], [547, 587], [588, 614], [594, 622], [609, 644], [613, 702], [604, 735]]

# for x,y in data3:
#     if cnt >= 10:
#         plt.show()
#         cnt = 0
#     plt.scatter(x,y,c='g')
#     cnt += 1 

# 히트맵 그리기
heatmapper = Heatmapper(
    point_diameter=100,  # the size of each point to be drawn
    point_strength=1,  # the strength, between 0 and 1, of each point to be drawn
    opacity=0.5,  # the opacity of the heatmap layer
    colours='default',  # 'default' or 'reveal'
                        # OR a matplotlib LinearSegmentedColorMap object 
                        # OR the path to a horizontal scale image
    grey_heatmapper='PIL'  # The object responsible for drawing the points
                           # Pillow used by default, 'PySide' option available if installed
)

# 이미지 위에 히트맵 그리기
heatmap = heatmapper.heatmap_on_img(example_points, example_img)
# # 출력 이미지 경로 설정
heatmap.save('image/ex1heatmap.png')

# 시각 흐름 그리기
draw = ImageDraw.Draw(example_img)
color = ["#FF0000", "#FF5E00", "#FFBB00", "#FFE400", "#ABF200", "#1DDB16", "#00D8FF", "#0054FF", "#0100FF", "#5F00FF"]
for i in range(len(example_points)-1):
    x,y = example_points[i]
    x2,y2 = example_points[i+1]
    draw.line((x,y,x2,y2),fill = color[i//10%10] ,width = 5)
    # draw.line((x,y,x2,y2),fill = 128,width = 5)
example_img.save("image/ex1heatmap"+'flow.png')
