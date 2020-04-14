sentence = "students flock to the arb for a variety of outdoor activities such as jogging"

sentence = sentence.split()
same_letter_count = 0
same_letter_List = []
for i in sentence:
    if i[0] == i[-1]:
        same_letter_count += 1
        same_letter_List.append(i)


print(same_letter_List, same_letter_count)

# sentence_word = list(map(lambda x: x[0], sentence))
# print(sentence)
# same_letter_count = []
# # word_list = [sentence[0][0]]
# same_letter_count_index = []
# # print(word_list)

# for i in range(len(sentence_word)-2):
#     count = 0
#     for x in range(i, len(sentence_word) -1):
#         if sentence_word[i] == sentence_word[x]:
#             same_letter_count_index.append()


# for i in range(len(sentence_word)-1):
#     if (sentence_word.count(sentence_word[i]) <= 1) and (sentence_word[i] != ""):
#         if (sentence_word[i] != ""):
#             sentence_word[i] =""
#     # print("hello world")
#     if sentence[i][0] in sentence:
#         print(sentence[i], sentence[i+1])
