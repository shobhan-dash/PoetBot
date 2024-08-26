from multiprocessing import Process
import gemini_service
import emotion_service
import load_balancer

if __name__ == '__main__':
    # Start both services in separate processes
    p1 = Process(target=gemini_service.run_gemini_app)
    p2 = Process(target=emotion_service.run_emotion_app)
    p3 = Process(target=load_balancer.run_load_balancer)
    
    p1.start()
    p2.start()
    p3.start()
    
    p1.join()
    p2.join()
    p3.join()
