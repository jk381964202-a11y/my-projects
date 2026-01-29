
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProjectCopy = async (title: string, category: string, keywords: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一名专业的设计文案撰写人。请为名为"${title}"的${category}项目写一段专业、高端的项目描述。
      要求包含这些关键词：${keywords}。
      篇幅控制在200字以内。重点突出设计理念、解决的痛点和视觉冲击力。请直接输出中文内容。`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "未能生成描述，请手动编写。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "生成描述时出错，请重试或手动编写。";
  }
};

export const analyzeDesign = async (imageData: string, prompt: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1],
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt + " 请用中文回答。" }] },
    });
    
    return response.text || "暂无分析结果。";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "分析图像时出错。";
  }
};
