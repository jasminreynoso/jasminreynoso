# Jasmin Reynoso
# Feb 19 2022
# ngram.py
# To generate more accurate text, a computer may learn an ngram language model, which is
# taking n-1 amount of words and examining the frequency of another word in the language model
# occurring right after. With this information, the computer is able to generate more accurate
# text based on different authors works, personal writing, etc.
#
# Usage instructions:
# python3 ngram.py n m input_file/s
# where n is the number for the n-gram model, m is the number of sentences, and input file is one or more txt file names
#
# Examples of input/output:
# Input: python3 ngram.py 3 4 karenina.txt warpeace.txt
# Output: "urged natásha seizing her mother ."
# "peace was keener than ever ."
# "did papa do what the french ran into our vanguard ."
# "growing ever stronger and higher to brace all his stewards to the swedish count ."
# Input: python3 ngram.py 5 3 crime.txt
# Output: "in his changed tone she seemed to hear the murderer speaking . "
# "she came back she seems to have got some secrets of late and i never have any secrets from you two ."
# "but the landlady is out of the question it s all right my dear boy he added slapping zametov on the shoulder ."
#
# Algorithm used:
# In order to build the ngram model, it is necessary to find the frequency of each ngram that occurs and
# the frequency of the n-1 gram that occurs.
# To do this, I iterated over the entire texts combined after removing certain punctuation,
# and inserting a start token to mark when sentences begin. Periods, exclamation marks, and punctuation
# marks are used to mark when sentences end. While iterating, I created the groups of n-1 grams and added
# them to a dict; if they occur again, they are given an increased value by 1. I also did this with the n
# gram group of words, adding them to a dict and increase the value if they occur again. To create a frequency
# table, I iterate over all the ngrams, and take the n-1 gram within them and find their occurrence number within
# the hist dict. I use this to divide the occurrence of the ngram, and doing this, I can store how often the nth
# word occurs after its history in the ngrams. To generate sentences, we must find an n gram with a
# start token. So once we have a list of these ngrams, we randomize them to choose one as our starting point.
# To find our next token, we use the last n-1 words in the current ngram. With this part of the ngram,
# we may add compatible ngrams that have the same history or first n-1 words as the current ngram's last n-1 words.
# We then generate a random decimal between 0 and 1 to randomize which token to add to the sentence. The frequency
# decimal of each ngram is subtracted randomly from the random decimal until it reaches negative or zero, and then
# the current ngram selected is chosen for. When selections are made, they are assessed to see if there is punctuation,
# as this marks the end of the sentence.

import re
import random
import sys

num_of_files = len(sys.argv)
orig_file = sys.argv[0]
n_value = int(sys.argv[1])
m_value = int(sys.argv[2])
list_of_files = sys.argv[3:]
corpus = []
hist_dict = {}
words = {}
words_frequency = {}
ngram_dict = {}
ngram_frequency = {}


def file_parsing(file_name):
    with open(file_name, 'r', encoding='utf-8') as f:
        file_text = f.read()
        file_text = file_text.lower()
        split_tokens = re.findall('[\w]+|[.!?]', file_text)
        split_tokens.insert(0, "<start>")
        for index in range(len(split_tokens)):
            if re.search(r'[.?!]', split_tokens[index]):
                split_tokens.insert(index + 1, "<start>")
        corpus.extend(split_tokens)


def unigram(split_tokens):
    unigram_dict = {
        "<start>": 0,
    }
    sentence_started = "false"
    while len(split_tokens) != 0:
        curr_token = split_tokens[0]
        if sentence_started == "false":
            unigram_dict["<start>"] += 1
            sentence_started = "true"
        if re.search(r'[.?!]', curr_token):
            punctuation = re.findall(r'[.?!]', curr_token)
            if punctuation[0] in unigram_dict:
                unigram_dict[punctuation[0]] += 1
            else:
                unigram_dict[punctuation[0]] = 1
            sentence_started = "false"
        elif curr_token in unigram_dict:
            unigram_dict[curr_token] += 1
        else:
            unigram_dict[curr_token] = 1
        split_tokens.remove(curr_token)


def words_into_set(split_tokens):
    global words
    for token in split_tokens:
        words.add(token)


def frequency_of_word():
    for word in corpus:
        if word in words_frequency:
            words_frequency[word] += 1
        else:
            words_frequency[word] = 1


def ngram(split_tokens):
    curr_ngram = []
    # print(split_tokens)
    for i in range(len(split_tokens) - (n_value - 1)):
        for j in range(n_value - 1):
            # creates n gram and incrementally adds each word n-1 words away
            curr_ngram.append(split_tokens[i + j])
        partial_ngram = tuple(curr_ngram)
        if partial_ngram not in hist_dict:
            hist_dict[partial_ngram] = 1
        else:
            hist_dict[partial_ngram] += 1
        # grabs nth word away from current start of ngram
        curr_token = split_tokens[i + (n_value - 1)]
        full_ngram = tuple(curr_ngram + [curr_token])
        if full_ngram in ngram_dict:
            ngram_dict[full_ngram] += 1
        else:
            ngram_dict[full_ngram] = 1
        curr_ngram.clear()


def frequency_decimals():
    global ngram_frequency
    ngram_frequency = ngram_dict.copy()
    for curr_ngram in ngram_frequency:
        partial_ngram = curr_ngram[0:(n_value - 1)]
        ngram_frequency[curr_ngram] = ngram_dict[curr_ngram] / hist_dict[partial_ngram]
    # pprint(ngram_frequency)


def generate_sentence():
    ended = False
    started = False
    started_decimal = random.random() - .01
    start_list = []
    sentence = []
    for potential_start in ngram_dict:
        if "<start>" == potential_start[0] and "." != potential_start[1] and "?" != potential_start[1] and "!" != potential_start[1]:
            start_list.append(potential_start)
    # terminates when we find punctuation
    while not ended:
        # terminates when a starting ngram is selected for
        while not started:
            curr_start = start_list[random.randint(0, len(start_list) - 1)]
            started_decimal -= ngram_frequency[curr_start]
            if started_decimal <= 0:
                sentence.extend(curr_start)
                started = True
        # each curr_ngram is based on sentences last n - 1 values
        curr_ngram = sentence[(len(sentence) - n_value + 1):len(sentence)]
        # to be populated with ngrams that can follow the current n-1 gram
        compatible_ngrams = []
        potential_ngram = []
        for full_ngram in ngram_dict:
            # add variable ensures full match b/t n-1 gram and n gram
            add = 0
            for i in range(len(curr_ngram)):
                if curr_ngram[i] != full_ngram[i]:
                    add = 0
                else:
                    add += 1
                    if add == (n_value - 1):
                        compatible_ngrams.append(full_ngram[0:n_value])
        potential_ngram = random.choices(compatible_ngrams, weights=[ngram_frequency[ng] for ng in compatible_ngrams])[0]
        # searches for punctuation that may end sentence generation
        for i in range(len(potential_ngram)):
            if re.search(r'[.?!]', potential_ngram[i]):
                sentence.extend(potential_ngram[i])
                ended = True
        if not ended:
            sentence.append(potential_ngram[-1])
    sentence.remove("<start>")
    string = ""
    for x in range(len(sentence)):
        string += sentence[x] + " "
    print(string)


def main():
    print("Hello, this my ngram python program. I am Jasmin Reynoso.")
    print("This program allows the user to build an n gram language model using texts of their choice.")
    print("Value of n:", n_value)
    print("Value of m:", m_value)
    for file in list_of_files:
        file_parsing(file)
        print("Text file used for model creation:", file)
    ngram(corpus)
    frequency_of_word()
    frequency_decimals()
    for _ in range(m_value):
        generate_sentence()


main()